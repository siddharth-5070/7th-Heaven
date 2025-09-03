const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const { user, items, total } = req.body;

    if (!user || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid order data" });
    }

    const newOrder = new Order({ user, items, total });
    await newOrder.save();

    res.json({ success: true, message: "Order placed" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error placing order" });
  }
});

module.exports = router;
