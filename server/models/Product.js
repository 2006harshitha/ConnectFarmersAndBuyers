const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import UUID for unique IDs

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    required: true,
    default: () => uuidv4(), // Auto-generate a unique productId
  },
  farmerUsername: {
    type: String,
    required: true,
  },
  category: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true }, // quantity in kg
  pricePerKg: { type: Number, required: true },
  image: { type: String, required: true },
  expiryDate: { type: Date, required: true },
});

// Optional: Ensure productId is unique before saving (extra safety)
ProductSchema.pre("save", async function (next) {
  if (!this.productId) {
    this.productId = uuidv4();
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
