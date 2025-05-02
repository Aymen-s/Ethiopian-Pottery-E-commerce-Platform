const Order = require("../../models/Order");

const getDeliveryOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const deliveryGuyId = req.user._id;

    const orders = await Order.find({
      assignedDeliveryGuy: deliveryGuyId,
      orderStatus: {
        $in: ["inShipping", "outForDelivery", "delivered", "disputed"],
      },
    }).populate("userId", "userName email");

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this delivery guy!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { getDeliveryOrders };
