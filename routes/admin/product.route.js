const express = require('express');
const router = express.Router();
const multer = require('multer');


// Import the controller functions
const productController = require('../../controllers/admin/product.controller');

const productValidation = require('../../validates/admin/product.validate'); // Import the validation file

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");


// Initialize multer with storage and filter configuration
const upload = multer();
//


router.get('/', productController.viewProduct);
router.patch("/change-status", productController.changeStatus);
router.patch("/change-multi", productController.changeStatusForMultiple);


// Define the DELETE route for Soft deleting a product by ID- xóa mềm
//router.patch('/delete', productController.deleteProduct); delete 1 record
router.patch('/delete/:ids', productController.deleteProduct);

// làm trang thùng rác
router.get('/trash', productController.getDeletedProducts);


// Route to restore a deleted product
router.patch('/restore/:ids', productController.restoreProduct);


router.patch("/change-position", productController.changePosition);


router.get("/create", productController.create);
router.post(
    "/create",
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    productValidation.productValidationRules, // Apply validation rules
    productValidation.validate, // Validate and handle errors
    productController.createPost
);

router.get("/edit/:id", productController.edit);
router.patch(
    "/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    productValidation.productValidationRules, // Apply validation rules
    productValidation.validate, // Validate and handle errors
    productController.editPatch
);


router.get("/detail/:id", productController.detail);

module.exports = router;
