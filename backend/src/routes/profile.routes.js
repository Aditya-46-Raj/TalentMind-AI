import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
    createOrUpdateProfile,
    getMyProfile,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.put(
    "/",
    protect,
    createOrUpdateProfile
);

router.get(
    "/me",
    protect,
    getMyProfile
);

export default router;