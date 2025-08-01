const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    buyerUsername: { type: String, required: true },
    farmerUsername: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Dispatched", "Cancelled"],
      default: "Pending",
    },
    address: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
