const express = require("express");
const router = express.Router();
const {
  addProduct,
  getFarmerProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post("/", addProduct);
router.get("/:farmerId", getFarmerProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
