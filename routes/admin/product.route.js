const express = require('express');
const router = express.Router();

// Import the controller functions
const productController = require('../../controllers/admin/product.controller');


router.get('/', productController.viewProduct);
router.patch("/change-status", productController.changeStatus);
router.patch("/change-multi", productController.changeStatusForMultiple);


// Define the DELETE route for deleting a product by ID
router.delete('/delete/:id', productController.deleteProduct);



module.exports = router;
