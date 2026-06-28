import dotenv from "dotenv";
dotenv.config();

import { connectCloudinary } from "./src/config/cloudinary.js";
connectCloudinary();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

const PORT = process.env.PORT || 5000;

console.log("JWT:", process.env.JWT_SECRET);
console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});