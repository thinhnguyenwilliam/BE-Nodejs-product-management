const express = require('express');
const router = express.Router();

// Import the controller functions
const productController = require('../../controllers/client/product.controller');

// Route for viewing products
router.get('/', productController.viewProducts);

// Route for creating a product
router.post('/create', productController.createProduct);

// Route for editing a product
router.patch('/edit', productController.editProduct);

// Route for deleting a product
router.delete('/delete', productController.deleteProduct);

// Export the router
module.exports = router;
