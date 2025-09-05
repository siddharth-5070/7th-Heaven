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

const welcomeMsg = document.getElementById("welcomeMsg");

let cart = [];
let currentUser = null;

// =======================
// DOM Elements
// =======================
const API_BASE = "https://seventh-heaven-g20e.onrender.com"; 
// ... all other DOM elements ...

// =======================
// Validation Functions
// =======================
function validateSignupForm() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const address = document.getElementById("signupAddress").value.trim();
  const mobile = document.getElementById("signupMobile").value.trim();

  if (!name) { alert("❌ Name is required"); return false; }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) { alert("❌ Invalid email address"); return false; }

  if (!password || password.length < 6) { alert("❌ Password must be at least 6 characters"); return false; }

  if (!address) { alert("❌ Address is required"); return false; }

  const mobileRegex = /^[0-9]{10}$/;
  if (!mobile || !mobileRegex.test(mobile)) { alert("❌ Mobile must be 10 digits"); return false; }

  return { name, email, password, address, mobile };
}

function validateLoginForm() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) { alert("❌ Invalid email"); return false; }

  if (!password) { alert("❌ Password is required"); return false; }

  return { email, password };
}


// =======================
// Modal Functions
// =======================
function openModal(modal) {
  modal.style.display = "flex";
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("active");
  document.getElementById("auth-buttons").classList.toggle("active");
}



// =======================
// Event Listeners for Modals
// =======================
loginBtn.addEventListener("click", () => openModal(loginModal));
signupBtn.addEventListener("click", () => openModal(signupModal));
cartBtn.addEventListener("click", () => {
  if (!currentUser) {
    alert("❌ Please log in to view your cart.");
    openModal(loginModal); // optional: open login modal
    return;
  }
  openModal(cartModal);
});


closeLogin.addEventListener("click", () => closeModal(loginModal));
closeSignup.addEventListener("click", () => closeModal(signupModal));
closeCart.addEventListener("click", () => closeModal(cartModal));
closeGallery.addEventListener("click", () => closeModal(galleryModal));

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
    galleryModalImg.src = img.src;
    openModal(galleryModal);
  });
});

// =======================
// Cart Functions
// =======================
function renderCart() {
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

// =======================
// Add to Cart
// =======================
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!currentUser) {
      alert("❌ Please log in to add items to your cart.");
      openModal(loginModal); // optional: open login modal
      return; // stop further execution
    }

    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
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
document.getElementById("submitOrder").addEventListener("click", async () => {
  try {
    const user = currentUser?.email || "guest";

    // Ensure items include quantity
    const items = cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = { user, items, total };
    console.log("📦 Sending order:", orderData);

    // ✅ FIXED: added await before fetch
    const response = await fetch(`${API_BASE}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (result.success) {
      alert("✅ Order placed successfully!");
      cart.length = 0; // clear cart
      renderCart();    // re-render cart
      closeModal(cartModal);
    } else {
      alert("❌ " + result.message);
    }
  } catch (error) {
    console.error("❌ Error submitting order:", error);
    alert("❌ Failed to place order. Please try again.");
  }
});




// =======================
// Auth Functions
// =======================
async function handleSignup() {
  const validated = validateSignupForm();
  if (!validated) return; // Stop if validation fails

  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      afterLogin();
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error signing up.");
  }
}

async function handleLogin() {
  const validated = validateLoginForm();
  if (!validated) return;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      afterLogin();
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error logging in.");
  }
}


signupSubmit.addEventListener("click", handleSignup);
loginSubmit.addEventListener("click", handleLogin);

logoutBtn.addEventListener("click", async () => {
  try {
    await fetch("https://seventh-heaven-g20e.onrender.com/api/logout", {
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

// =======================
// Navbar & After Login
// =======================
function updateNavbar() {
  if (currentUser) {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    welcomeMsg.textContent = `Welcome, ${currentUser.name}!`;
  } else {
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    welcomeMsg.textContent = "";
  }
}

function afterLogin() {
  renderCart();
  updateNavbar();
  closeModal(loginModal);
  closeModal(signupModal);
}

// =======================
// Check if user is logged in on page load
// =======================
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(
      "https://seventh-heaven-g20e.onrender.com/api/verify",
      {
        credentials: "include",
      }
    );
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      updateNavbar();
    }
  } catch (err) {
    console.error("Error verifying login:", err);
  }
});
