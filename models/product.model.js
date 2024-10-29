const mongoose = require('mongoose');

// Define a schema for the Product model
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Ensure that title is provided
        trim: true      // Remove any leading or trailing whitespace
    },
    description: {
        type: String,
        required: true, 
        trim: true      
    },
    price: {
        type: Number,
        required: true, // Ensure that price is provided
        min: 0          // Ensure that price is non-negative
    },
    discountPercentage: {
        type: Number,
        required: true, 
        min: 0          
    },
    stock: {
        type: Number,
        required: true, 
        min: 0          
    },
    status: {
        type: String,
        required: true, 
        trim: true      
    },
    position: {
        type: Number,
        required: true, 
        min: 0          
    },
    deleted: {
        type: Boolean,
        default: false // Default value is false if not specified
    },
    thumbnail: {
        type: String,
        required: true, // Ensure that thumbnail URL is provided
        trim: true      // Remove any leading or trailing whitespace
    }
}, {
    // Automatically add createdAt and updatedAt fields
    // which can be useful for tracking when documents are created or updated.
    timestamps: true 
});



// Create a model from the schema
const ProductModel = mongoose.model(
    'Product', 
    productSchema,
    'products'// đảm bảo chọc vào đúng collection(products) trong mongoDB, nếu như mình kg cần thèm quan tâm tên collection
);

module.exports = ProductModel;
