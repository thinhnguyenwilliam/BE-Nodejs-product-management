const express = require('express');
const router = express.Router();

// Import the controller functions
const adminController = require('../../controllers/admin/dashboard.controller');


router.get('/', adminController.viewPageAdmin);





module.exports = router;
