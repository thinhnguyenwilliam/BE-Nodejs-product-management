const ProductModel = require('../../models/product.model')


module.exports.viewProduct = async (req, res) => {
    //req is object
    //req.query is object
    // object in object
    //phần lọc filter xem thêm cách mình làm

    const objectFind={
        deleted: false
    };


    if (req.query.status) {
        objectFind.status = req.query.status;
    }
    //console.log(objectFind);

    const danhSachSanPham = await ProductModel.find(objectFind);
    //console.log('test xem có danh sách sản phẩm không: ',danhSachSanPham);

    res.render('admin/pages/products/index', {
        pageTitle: 'Trang product của admin',
        danhSachVer2: danhSachSanPham,
    });
};