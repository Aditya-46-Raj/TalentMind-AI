import Profile from "../models/Profile.js";

export const createOrUpdateProfile = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            {
                user: req.user._id,
            },
            {
                ...req.body,
                user: req.user._id,
            },
            {
                new: true,
                upsert: true,
            }
        );

        res.status(200).json({
            success: true,
            profile,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user._id,
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.status(200).json({
            success: true,
            profile,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};