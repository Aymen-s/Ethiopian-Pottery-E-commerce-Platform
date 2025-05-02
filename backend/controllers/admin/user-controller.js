const User = require("../../models/User");

const getDeliveryGuys = async (req, res) => {
  try {
    const deliveryGuys = await User.find({ role: "delivery-guy" }).select(
      "userName email _id"
    );

    if (!deliveryGuys.length) {
      return res.status(404).json({
        success: false,
        message: "No delivery guys found!",
      });
    }

    res.status(200).json({
      success: true,
      data: deliveryGuys,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { getDeliveryGuys };
