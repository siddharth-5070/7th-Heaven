const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
