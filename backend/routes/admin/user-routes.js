const express = require("express");
const { authMiddleware } = require("../auth/auth-routes");
const { getDeliveryGuys } = require("../../controllers/admin/user-controller");

const router = express.Router();

// Middleware to ensure only admins can access this route
const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Only admins can access this route",
    });
  }
  next();
};

router.use(authMiddleware, restrictToAdmin);

router.get("/delivery-guys", getDeliveryGuys);

module.exports = router;
