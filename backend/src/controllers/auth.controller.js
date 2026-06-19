export const registerUser = async (req, res) => {
    res.status(201).json({
        success: true,
        message: "Register route working",
    });
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