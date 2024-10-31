const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import the controller functions
const productController = require('../../controllers/admin/product.controller');


// Multer configuration for image storage
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/images/'); // Folder to store images
    },
    filename: (req, file, cb) => {
        const fileName  = `${Date.now()}-${file.originalname}`; // Keep original file name with timestamp
        cb(null, fileName ); // No need to add file extension again
    }
});

// Multer file filter to allow only image files
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
};
//

// Multer filter to accept only video files
const videoStorage = (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only MP4, AVI, and MOV files are allowed.'), false);
    }
};

// File filter to accept only ZIP files
const zipStorage = (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only ZIP files are allowed.'), false);
    }
};

// Initialize multer with storage and filter configuration
const upload = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // Optional: limit file size to 50MB
});
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
router.post("/create", upload.single('thumbnail_img_post'), productController.createPost);

module.exports = router;
