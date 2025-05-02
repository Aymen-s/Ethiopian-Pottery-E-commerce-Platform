const express = require("express");
const {
  getDeliveryOrders,
} = require("../../controllers/delivery/delivery-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.get("/orders", authMiddleware, getDeliveryOrders);

module.exports = router;
