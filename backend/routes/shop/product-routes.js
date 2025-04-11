const express = require("express");
const {
  getFilteredProducts,
  getproductDetails,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getproductDetails);

module.exports = router;
