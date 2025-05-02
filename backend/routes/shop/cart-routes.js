const express = require("express");
const {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
} = require("../../controllers/shop/cart-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/get", authMiddleware, fetchCartItems);
router.put("/update-cart", authMiddleware, updateCartItemQty);
router.delete("/:productId", authMiddleware, deleteCartItem);

module.exports = router;
