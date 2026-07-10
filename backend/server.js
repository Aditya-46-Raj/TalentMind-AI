import dotenv from "dotenv";
dotenv.config();

import { connectCloudinary } from "./src/config/cloudinary.js";
connectCloudinary();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`
  );
});