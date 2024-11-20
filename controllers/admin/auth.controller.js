const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const bcrypt = require('bcryptjs');


module.exports.login = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Login page data",
        pageTitle: "Đăng nhập",
    });
};


module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email and ensure it is not deleted
        const user = await Account.findOne({
            email: email,
            deleted: false
        });

        // If the user does not exist
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email không tồn tại!"
            });
        }

        // Compare the entered password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Sai mật khẩu!"
            });
        }

        // Check if the account is active
        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Tài khoản đang bị khóa!"
            });
        }

        // Set cookie with token and expiration time (e.g., 1 hour)
        res.cookie("token", user.token, {
            maxAge: 3600000, // Cookie expires in 1 hour (in milliseconds)
            httpOnly: true, // Make the cookie accessible only through HTTP (security)
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
            sameSite: 'Strict' // Optional: Add SameSite for CSRF protection
        });

        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            redirectUrl: `/${systemConfig.prefixAdmin}/dashboard`
        });

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống, vui lòng thử lại sau."
        });
    }
};



module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};