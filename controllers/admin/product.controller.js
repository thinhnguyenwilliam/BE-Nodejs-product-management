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


    //pagination
    const page = parseInt(req.query.page) || 1;
    //console.log(page);

    const pageSize = 4; // Number of products per page
    if(req.query.limit)
        pageSize=parseInt(req.query.limit);

    const skip = (page - 1) * pageSize;// bắt đầu từ vị trí 0 trong database    
    //end pagination



    // Count total products
    const totalProducts = await ProductModel.countDocuments(objectFind);
    const totalPages = Math.ceil(totalProducts / pageSize);

    // Fetch products for the current page
    const danhSachSanPham = await ProductModel.find(objectFind)
        .skip(skip)
        .limit(pageSize);
    //console.log('test xem có danh sách sản phẩm không: ',danhSachSanPham);

    res.render('admin/pages/products/index', {
        pageTitle: 'Trang product của admin',
        danhSachVer2: danhSachSanPham,
        currentPage: page,
        totalPage: totalPages
    });
};