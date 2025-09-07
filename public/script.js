// =======================
// DOM Elements
// =======================
const API_BASE = "https://seventh-heaven-g20e.onrender.com";
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const cartModal = document.getElementById("cartModal");
const galleryModal = document.getElementById("galleryModal");
const galleryModalImg = document.getElementById("galleryModalImg");

const loginBtn = document.getElementById("navbarLoginBtn");
const signupBtn = document.getElementById("navbarSignupBtn");
const logoutBtn = document.getElementById("logoutBtn");
const cartBtn = document.getElementById("cartBtn");

const closeLogin = document.getElementById("closeLogin");
const closeSignup = document.getElementById("closeSignup");
const closeCart = document.getElementById("closeCart");
const closeGallery = document.getElementById("closeGallery");

const loginSubmit = document.getElementById("loginSubmit");
const signupSubmit = document.getElementById("signupSubmit");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const submitOrderBtn = document.getElementById("submitOrder");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const authButtons = document.querySelector(".auth-buttons");

const welcomeMsg = document.getElementById("welcomeMsg");

let cart = [];
let currentUser = null;

// =======================
// Mobile Menu Toggle
// =======================
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks?.classList.toggle("active");
    authButtons?.classList.toggle("active");
    menuToggle.classList.toggle("open");
  });
}

// =======================
// Modal Functions
// =======================
function openModal(modal) {
  if (modal) {
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
  }
}

function closeModal(modal) {
  if (modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }
}

// =======================
// Event Listeners for Modals
// =======================
if (loginBtn) loginBtn.addEventListener("click", () => openModal(loginModal));
if (signupBtn) signupBtn.addEventListener("click", () => openModal(signupModal));
if (cartBtn) cartBtn.addEventListener("click", () => openModal(cartModal));

if (closeLogin) closeLogin.addEventListener("click", () => closeModal(loginModal));
if (closeSignup) closeSignup.addEventListener("click", () => closeModal(signupModal));
if (closeCart) closeCart.addEventListener("click", () => closeModal(cartModal));
if (closeGallery) closeGallery.addEventListener("click", () => closeModal(galleryModal));

window.addEventListener("click", (e) => {
  if (e.target === loginModal) closeModal(loginModal);
  if (e.target === signupModal) closeModal(signupModal);
  if (e.target === cartModal) closeModal(cartModal);
  if (e.target === galleryModal) closeModal(galleryModal);
});

// =======================
// Gallery Modal
// =======================
document.querySelectorAll(".gallery-container img").forEach((img) => {
  img.addEventListener("click", () => {
    if (galleryModalImg) galleryModalImg.src = img.src;
    openModal(galleryModal);
  });
});

// =======================
// Cart Functions
// =======================
function renderCart() {
  if (!cartItemsEl || !cartTotalEl) return;

  cartItemsEl.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ₹${item.price} × ${item.quantity} 
      <button onclick="decreaseQty(${index})">➖</button>
      <button onclick="increaseQty(${index})">➕</button>
      <button onclick="removeFromCart(${index})">❌</button>
    `;
    cartItemsEl.appendChild(li);
  });
  cartTotalEl.textContent = total;
}

function increaseQty(index) {
  cart[index].quantity++;
  renderCart();
}

function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1); // remove item at index
  renderCart(); // re-render cart
}

// =======================
// Add to Cart
// =======================
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!currentUser) {
      alert("❌ Please login to add items to the cart.");
      openModal(loginModal);
      return;
    }
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);

    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    renderCart();
    alert(`${name} added to cart!`);
  });
});

// =======================
// Submit Order
// =======================
if (submitOrderBtn) {
  submitOrderBtn.addEventListener("click", async () => {
    try {
      if (cart.length === 0) {
        alert("❌ Your cart is empty!");
        return;
      }

      const user = currentUser?.email || "guest";
      const items = cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Get payment method
      const paymentMethod =
        document.querySelector('input[name="payment"]:checked')?.value || "COD";

      const orderData = { user, items, total, paymentMethod };
      console.log("📦 Sending order:", orderData);

      const response = await fetch(`${API_BASE}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Order placed successfully! Payment: ${paymentMethod}`);
        cart.length = 0;
        renderCart();
        closeModal(cartModal);
      } else {
        alert("❌ " + result.message);
      }
    } catch (error) {
      console.error("❌ Error submitting order:", error);
      alert("❌ Failed to place order. Please try again.");
    }
  });
}

// =======================
// Auth Functions
// =======================
async function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById("signupName")?.value;
  const email = document.getElementById("signupEmail")?.value;
  const password = document.getElementById("signupPassword")?.value;
  const address = document.getElementById("signupAddress")?.value;
  const mobile = document.getElementById("signupMobile")?.value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, address, mobile }),
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      alert("Signup successful! Please login.");
      closeModal(signupModal);
    } else {
      alert(data.message || "Signup failed.");
    }
  } catch (err) {
    console.error("❌ Error signing up:", err);
    alert("Error signing up.");
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      alert("Login successful!");
      currentUser = data.user;
      afterLogin();
      updateCartButtons();
    } else {
      alert(data.message || "Login failed.");
    }
  } catch (err) {
    console.error("❌ Error logging in:", err);
    alert("Error logging in.");
  }
}

if (signupSubmit) signupSubmit.addEventListener("click", handleSignup);
if (loginSubmit) loginSubmit.addEventListener("click", handleLogin);

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      currentUser = null;
      cart = [];
      renderCart();
      updateNavbar();
      alert("Logged out successfully!");
    } catch (err) {
      console.error(err);
    }
  });
}

// =======================
// Navbar & After Login
// =======================
function updateNavbar() {
  if (currentUser) {
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (welcomeMsg) welcomeMsg.textContent = `Welcome, ${currentUser.name}!`;
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (welcomeMsg) welcomeMsg.textContent = "";
  }
}

function afterLogin() {
  renderCart();
  updateNavbar();
  closeModal(loginModal);
  closeModal(signupModal);
}

function updateCartButtons() {
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    if (!currentUser) {
      btn.classList.add("disabled");
    } else {
      btn.classList.remove("disabled");
    }
  });
}

// Call after login or on page load
updateCartButtons();

// =======================
// Check if user is logged in on page load
// =======================
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${API_BASE}/api/verify`, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      updateNavbar();
    }
  } catch (err) {
    console.error("Error verifying login:", err);
  }
});
