import express from "express";
import {
    registerUser,
    loginUser,
    getMe,
    uploadAvatar,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

router.put("/avatar", protect, uploadAvatar);

export default router;