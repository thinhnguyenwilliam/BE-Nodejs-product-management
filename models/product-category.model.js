const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Title is mandatory
        trim: true, // Remove extra spaces
        maxlength: 100 // Optional: Limit title length
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to another category
        ref: 'ProductCategory', // Model reference for parent category
        default: null // Allow top-level categories
    },
    description: {
        type: String,
        maxlength: 500 // Optional: Limit description length
    },
    thumbnail: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/|\/).*\.(jpg|jpeg|png|gif)$/.test(v); // Validate image URL or path
            },
            message: props => `${props.value} is not a valid thumbnail URL!`
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'], // Restrict to predefined values
        default: 'active'
    },
    position: {
        type: Number,
        default: 0 // Default position
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, 'products-category');

module.exports = ProductCategory;