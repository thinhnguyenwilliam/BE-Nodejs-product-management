const Role = require("../../models/role.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../../models/account.model");
require("dotenv").config();



module.exports.ViewAllAccounts = (req, res) => {
    res.json({
        success: true,
        pageTitle: "Tài khoản quản trị",
        message: "Accounts management page"
    });
};

module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });
    res.json({
        pageTitle: "Tạo tài khoản quản trị",
        roles: roles
    });
}


module.exports.createPost = async (req, res) => {
    try {
        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        // Generate a JWT token
        const token = jwt.sign(
            {
                email: req.body.email,
                phoneNumber: req.body.phone
            }, // Payload (e.g., email or any identifier)
            process.env.JWT_SECRET || "your-secret-key", // Secret key (use env variable in production)
            { expiresIn: "1d" } // Token expiration time
        );
        req.body.token = token;

        // Create and save the account
        const account = new Account(req.body);
        await account.save();

        // Return JSON response
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            account: {
                id: account._id,
                fullName: account.fullName,
                email: account.email,
                phone: account.phone,
                role_id: account.role_id,
                status: account.status,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
            },
            token: token,
        });
    } catch (err) {
        console.error("Error creating account:", err);
        res.status(500).json({ success: false, message: "Failed to create account" });
    }
};