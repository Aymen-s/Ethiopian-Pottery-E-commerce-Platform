const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const {
      category = [],
      cooperative = [],
      sortBy = "price-lowtohigh",
    } = req.query;
    let filters = {};
    if (category.length > 0) {
      filters.category = { $in: category.split(",") };
    }
    if (cooperative.length > 0) {
      filters.cooperative = { $in: cooperative.split(",") };
    }
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }
    const products = await Product.find(filters).sort(sort);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getproductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getFilteredProducts,
  getproductDetails,
};
