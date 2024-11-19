const Role = require("../../models/role.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../../models/account.model");
require("dotenv").config();



module.exports.ViewAllAccounts = async (req, res) => {
    // Fetch accounts with populated roles
    const records = await Account.find({ deleted: false })
        .populate({
            path: "role_id",
            match: { deleted: false }, // Ensure only non-deleted roles are fetched
            select: "title", // Only fetch the 'title' field from Role
        })
        .lean(); // Convert Mongoose documents to plain JavaScript objects

    // Add role_title to each account record
    const enrichedRecords = records.map((item) => ({
        ...item,
        role_id: item.role_id?._id || null, // Replace role_id with just its _id
        role_title: item.role_id?.title || null, // Safely access role title
    }));

    res.json({
        success: true,
        pageTitle: "Tài khoản quản trị",
        message: "Accounts management page",
        records: enrichedRecords
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


module.exports.edit = async (req, res) => {
    try {
        const roles = await Role.find({
            deleted: false,
        });

        const account = await Account.findOne({
            _id: req.params.id,
            deleted: false,
        });

        res.status(200).json({
            pageTitle: "Chỉnh sửa tài khoản quản trị",
            roles: roles,
            account: account,
        });
    } catch (err) {
        console.error("Error fetching account or roles:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch data for editing",
        });
    }
};



module.exports.editPatch = async (req, res) => {
    try {
        // Update the Account document
        const result = await Account.updateOne(
            {
                _id: req.params.id,
                deleted: false,
            },
            req.body
        );

        // Check if the document was modified
        if (result.modifiedCount > 0) {
            res.status(200).json({
                success: true,
                message: "Account updated successfully.",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Account not found or no changes made.",
            });
        }
    } catch (err) {
        console.error("Error updating account:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update account.",
        });
    }
};
