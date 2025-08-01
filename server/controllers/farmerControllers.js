const User = require("../models/User");
const Order = require("../models/Order");

exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id).select("-password");
    if (!farmer)
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    res.json(farmer);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch profile" });
  }
};

exports.updateFarmerProfile = async (req, res) => {
  try {
    const farmer = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.json({ success: true, farmer });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};

exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.params.farmerId }).populate(
      "products.product buyer"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};
