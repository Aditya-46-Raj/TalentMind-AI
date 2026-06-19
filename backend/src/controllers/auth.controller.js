import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (
    req,
    res
) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message:
                    "User already exists",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        const token =
            generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Server Error",
        });
    }
};

export const loginUser = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Login route working",
    });
};

export const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Current user route working",
    });
};