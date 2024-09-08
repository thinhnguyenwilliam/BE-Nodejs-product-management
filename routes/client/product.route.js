const express = require('express');
const router = express.Router();

// Route for viewing products
router.get('/', (req, res) => {
    res.render('client/pages/products/index');
});


// Route for creating a product
router.post('/create', (req, res) => {
    res.render('client/pages/products/create');
});

// Route for editing a product
router.patch('/edit', (req, res) => {
    res.render('client/pages/products/edit');
});

// Route for deleting a product
router.delete('/delete', (req, res) => {
    res.render('client/pages/products/delete');
});


// Export the router
module.exports = router;
