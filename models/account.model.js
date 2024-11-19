const mongoose = require("mongoose");


const accountSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Invalid email format"],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        token: {
            type: String,
            default: null,
        },
        phone: {
            type: String,
            trim: true
        },
        avatar: {
            type: String,
            default: null, // You can store a URL or file path here
        },
        role_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role", // Assuming a `Role` model exists
        },
        status: {
            type: String,
            enum: ["active", "inactive", "pending"],
            default: "active",
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);



const Account = mongoose.model("Account", accountSchema, "accounts");
module.exports = Account;
