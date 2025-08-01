const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

// Add or update product in cart
router.post("/add", async (req, res) => {
  const { buyerUsername, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ buyerUsername });

    if (!cart) {
      cart = new Cart({ buyerUsername, items: [] });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get buyer's cart
router.get("/:buyerUsername", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      buyerUsername: req.params.buyerUsername,
    }).populate("items.product");

    res.json(cart || { buyerUsername: req.params.buyerUsername, items: [] });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update quantity (+/-)
router.put("/update", async (req, res) => {
  const { buyerUsername, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ buyerUsername });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(productIndex, 1);
      } else {
        cart.items[productIndex].quantity = quantity;
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove product from cart
router.delete("/remove", async (req, res) => {
  const { buyerUsername, productId } = req.body;

  try {
    const cart = await Cart.findOne({ buyerUsername });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error removing product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
