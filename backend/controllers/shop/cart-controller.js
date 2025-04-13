const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;
    if (!productId || !quantity || !userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Please provide all required fields.",
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
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Please provide all required fields.",
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
    const { productId, quantity, userId } = req.body;
    if (!productId || !quantity || !userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Please provide all required fields.",
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
    const { productId, userId } = req.params;
    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Please provide all required fields.",
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

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
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
    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error deleting item" });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
};
