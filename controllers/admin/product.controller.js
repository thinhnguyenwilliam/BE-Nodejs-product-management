const ProductModel = require('../../models/product.model')


module.exports.viewProduct = async (req, res) => {
    //req is object
    //req.query is object
    // object in object
    //phần lọc filter xem thêm cách mình làm

    ///// Filter
    const objectFind={
        deleted: false
    };


    if (req.query.status) 
        objectFind.status = req.query.status;
    //console.log(objectFind);
    //////////// End Filter


    // search
    if (req.query.keyword)
    {
        const regex = new RegExp(req.query.keyword, "i");//"i" flag: Case-insensitive search: Tìm kiếm không phân biệt chữ hoa chữ thường
        objectFind.title = regex;
    }
    //end search




    const danhSachSanPham = await ProductModel.find(objectFind);
    //console.log('test xem có danh sách sản phẩm không: ',danhSachSanPham);

    res.render('admin/pages/products/index', {
        pageTitle: 'Trang product của admin',
        danhSachVer2: danhSachSanPham,
    });
};