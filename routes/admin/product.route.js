const express = require('express');
const router = express.Router();

// Import the controller functions
const productController = require('../../controllers/admin/product.controller');


router.get('/', productController.viewProduct);
router.patch("/change-status", productController.changeStatus);
router.patch("/change-multi", productController.changeStatusForMultiple);


// Define the DELETE route for Soft deleting a product by ID- xóa mềm
router.patch('/delete/:ids', productController.deleteProduct);

// làm trang thùng rác
router.get('/trash', productController.getDeletedProducts);


// Route to restore a deleted product
router.patch('/restore/:ids', productController.restoreProduct);


module.exports = router;
