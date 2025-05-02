const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const mongoose = require("mongoose");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Get userId from authMiddleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }
    const userId = req.user._id;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Product ID and quantity are required.",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (findCurrentProductIndex > -1) {
      cart.items[findCurrentProductIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId format",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price image salePrice",
    });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }
    const populateCartItems = validItems.map((item) => {
      return {
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        image: item.productId.image,
        salePrice: item.productId.salePrice,
        quantity: item.quantity,
      };
    });
    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }
    const userId = req.user._id;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Product ID and quantity are required.",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (findCurrentProductIndex > -1) {
      cart.items[findCurrentProductIndex].quantity = quantity;
      await cart.save();
      await cart.populate({
        path: "items.productId",
        select: "title price image salePrice",
      });
      const populateCartItems = cart.items.map((item) => {
        return {
          productId: item.productId ? item.productId._id : null,
          title: item.productId ? item.productId.title : "product not found",
          price: item.productId ? item.productId.price : null,
          image: item.productId ? item.productId.image : null,
          salePrice: item.productId ? item.productId.salePrice : null,
          quantity: item.quantity,
        };
      });
      return res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: {
          ...cart._doc,
          items: populateCartItems,
        },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Product ID is required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or productId format.",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price image salePrice",
    });
    if (!cart) {
      console.log("Cart not found for userId:", userId);
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter((item) => {
      if (!item.productId || !item.productId._id) {
        return false;
      }
      const itemProductId = item.productId._id.toString();
      return itemProductId !== productId;
    });

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "title price image salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId?._id || null,
      title: item.productId?.title || "product not found",
      price: item.productId?.price || null,
      image: item.productId?.image || null,
      salePrice: item.productId?.salePrice || null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
      data: {
        userId: cart.userId,
        items: populateCartItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting item",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
};
