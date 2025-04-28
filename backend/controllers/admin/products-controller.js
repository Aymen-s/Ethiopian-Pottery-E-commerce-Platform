const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(url);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error uploading image" });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      cooperative,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const product = new Product({
      image,
      title,
      description,
      category,
      cooperative,
      price,
      salePrice,
      totalStock,
    });
    await product.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error adding product" });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      cooperative,
      price,
      salePrice,
      totalStock,
    } = req.body;

    let product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    product.image = image || product.image;
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.cooperative = cooperative || product.cooperative;
    product.price = price === "" ? 0 : price || product.price;
    product.salePrice = salePrice === "" ? 0 : salePrice || product.salePrice;
    product.totalStock = totalStock || product.totalStock;
    await product.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error editing product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error editing product" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting product" });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
