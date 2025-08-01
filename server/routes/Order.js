const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");

// Place Order
router.post("/", async (req, res) => {
  console.log("[Order API] POST /api/orders called");
  console.log("[Order API] Request body:", req.body);

  try {
    const { buyerUsername, address } = req.body;

    if (!buyerUsername) {
      console.log("[Order API] Missing buyerUsername");
      return res.status(400).json({ message: "Buyer username is required" });
    }

    // Log before fetching cart
    console.log("[Order API] Fetching cart for buyer:", buyerUsername);

    // ✅ FIX: Changed productId → product
    const cart = await Cart.findOne({ buyerUsername }).populate(
      "items.product"
    );

    if (!cart) {
      console.log("[Order API] No cart found for:", buyerUsername);
      return res.status(400).json({ message: "Cart not found" });
    }

    if (cart.items.length === 0) {
      console.log("[Order API] Cart is empty for:", buyerUsername);
      return res.status(400).json({ message: "Cart is empty" });
    }

    console.log("[Order API] Cart found:", cart.items.length, "items");

    // Create orders
    const orders = await Promise.all(
      cart.items.map(async (item) => {
        console.log(
          "[Order API] Creating order for product:",
          item.product?.name || "Unknown Product"
        );

        if (!item.product) {
          console.log("[Order API] Missing product in cart item");
          throw new Error("Invalid product in cart");
        }

        return await Order.create({
          buyerUsername,
          farmerUsername: item.product.farmerUsername,
          product: item.product._id,
          quantity: item.quantity,
          totalPrice: item.product.pricePerKg * item.quantity,
          address: address || "Address skipped for testing",
        });
      })
    );

    // Clear the cart
    console.log("[Order API] Clearing cart for buyer:", buyerUsername);
    await Cart.updateOne({ buyerUsername }, { $set: { items: [] } });

    console.log("[Order API] Orders placed successfully:", orders.length);
    res.status(201).json({ message: "Order placed successfully", orders });
  } catch (error) {
    console.error("[Order API] Error placing order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Orders for Buyer
router.get("/buyer/:username", async (req, res) => {
  console.log(
    "[Order API] GET /api/orders/buyer called for:",
    req.params.username
  );
  try {
    const orders = await Order.find({
      buyerUsername: req.params.username,
    }).populate("product");

    console.log("[Order API] Buyer orders found:", orders.length);
    res.json(orders);
  } catch (error) {
    console.error("[Order API] Failed to fetch buyer orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get Orders for Farmer
router.get("/farmer/:username", async (req, res) => {
  console.log(
    "[Order API] GET /api/orders/farmer called for:",
    req.params.username
  );
  try {
    const orders = await Order.find({
      farmerUsername: req.params.username,
    }).populate("product");

    console.log("[Order API] Farmer orders found:", orders.length);
    res.json(orders);
  } catch (error) {
    console.error("[Order API] Failed to fetch farmer orders:", error);
    res.status(500).json({ message: "Failed to fetch farmer orders" });
  }
});

// Update Order Status (Farmer)
router.put("/:id/status", async (req, res) => {
  console.log(
    "[Order API] PUT /api/orders/:id/status called for:",
    req.params.id
  );
  try {
    const { status } = req.body;
    console.log("[Order API] Updating order status to:", status);

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      console.log("[Order API] Order not found for id:", req.params.id);
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("[Order API] Order status updated successfully");
    res.json(order);
  } catch (error) {
    console.error("[Order API] Failed to update order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = router;
