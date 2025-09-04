// routes/order.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// =======================
// Place an Order
// =======================
router.post("/", async (req, res) => {
  try {
    console.log("📦 Incoming order:", req.body); // Debug log

    const { user, items, total } = req.body;

    // Validate request body
    if (!user || !items || !Array.isArray(items) || items.length === 0 || !total) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    // Create new order
    const newOrder = new Order({
      user,
      items,
      total,
      date: new Date()
    });

    await newOrder.save();

    res.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ success: false, message: "Server error while placing order" });
  }
});

// =======================
// Get All Orders (optional, for admin or testing)
// =======================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ success: false, message: "Server error fetching orders" });
  }
});

module.exports = router;
