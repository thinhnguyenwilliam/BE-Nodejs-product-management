// Controller function for viewing products
module.exports.viewProducts = (req, res) => {
    res.render('client/pages/products/index',{
        pageTitle:'trang danh sách sản phẩm'
    });
};

// Controller function for creating a product
module.exports.createProduct = (req, res) => {
    res.render('client/pages/products/create');
};

// Controller function for editing a product
module.exports.editProduct = (req, res) => {
    res.render('client/pages/products/edit');
};

// Controller function for deleting a product
module.exports.deleteProduct = (req, res) => {
    res.render('client/pages/products/delete');
};
