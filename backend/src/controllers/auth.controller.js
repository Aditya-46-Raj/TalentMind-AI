export const loginUser = async (
    req,
    res
) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid credentials",
            });
        }

        const isMatch =
            await user.comparePassword(
                password
            );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid credentials",
            });
        }

        const token =
            generateToken(user._id);

        res.status(200).json({
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

export const getMe = async (
    req,
    res
) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
};
