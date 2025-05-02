const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "inShipping",
      "outForDelivery",
      "pendingConfirmation",
      "delivered",
      "disputed",
    ],
    default: "pending",
  },
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
  assignedDeliveryGuy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  disputeReason: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
