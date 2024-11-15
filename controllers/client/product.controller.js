const ProductModel = require("../../models/product.model");

// Controller function for viewing products
module.exports.viewProducts = async (req, res) => {
    const danhSachSanPham = await ProductModel
        .find({
            status: 'active',
            deleted: false
        })
        .sort({
            position: -1,
            title: 1,
            price: -1
        });
    //console.log('test xem có danh sách sản phẩm không: ',danhSachSanPham);

    // Calculate the new price for each product
    danhSachSanPham.forEach((item) => {
        if (item.discountPercentage) {
            const discount = item.discountPercentage / 100;
            item.priceNew = item.price * (1 - discount);
            item.priceNew = item.priceNew.toFixed(0); // Ensure priceNew is an integer(not a float)
        } else {
            item.priceNew = item.price.toFixed(0); // No discount applied
        }
    });


    res.render('client/pages/products/index', {
        pageTitle: 'trang danh sách sản phẩm',
        danhSachVer1: danhSachSanPham
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


module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    try {
        const product = await ProductModel.findOne({
            slug: slug,
            status: "active",
            deleted: false
        });

        if (!product) {
            return res.status(404).render("client/pages/products/not-found", {
                pageTitle: "Product Not Found"
            });
        }

        product.priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0);

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("client/pages/products/error", {
            pageTitle: "System Error"
        });
    }
}

