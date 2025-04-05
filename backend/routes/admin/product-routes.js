const express = require("express");
const { upload } = require("../../helpers/cloudinary");
const {
  handleImageUpload,
} = require("../../controllers/admin/products-controller");

const router = express.Router();
router.post("/upload-image", upload.single("my_file"), handleImageUpload);

module.exports = router;
