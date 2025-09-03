const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "your_secret_key_here"; // use .env in production

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, address, mobile } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      mobile,
    });

    // Create JWT token
    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true });
    res.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error creating user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true });
    res.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error logging in" });
  }
});

// Verify token
router.get("/verify", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ success: false });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (err) {
    res.json({ success: false });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

module.exports = router;
