const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dlxcepkyp",
  api_key: "658671952131613",
  api_secret: "Flw53sQ7UNEmp5549gdg-4ZlpdM",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return result;
}

const upload = multer({ storage });

module.exports = {
  upload,
  imageUploadUtil,
};
