const { v2: cloudinary } = require("cloudinary");
require("dotenv").config(); // Ensure variables are loaded if not already done early

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
