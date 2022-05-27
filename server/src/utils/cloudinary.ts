import Cloudinary from "cloudinary";

import config from "../configs/config";

const cloudinary = Cloudinary.v2;

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export default cloudinary;
