import { Cloudinary } from "@cloudinary/url-gen";

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
  }
});

export default cld;