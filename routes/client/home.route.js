const express = require('express');
const router = express.Router();



const homeController = require('../../controllers/client/home.controller');
router.get('/', homeController.viewHome);


// Export the router
module.exports = router;
