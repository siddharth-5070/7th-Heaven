const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["COD", "UPI"], default: "COD" },
  status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
