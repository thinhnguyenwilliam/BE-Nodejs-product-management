const ProductModel = require('../../models/product.model')


module.exports.viewProduct = async (req, res) => {
    //req is object
    //req.query is object
    // object in object
    //phần lọc filter xem thêm cách mình làm

    ///// Filter
    const objectFind = {
        deleted: false
    };


    if (req.query.status)
        objectFind.status = req.query.status;
    //console.log(objectFind);
    //////////// End Filter


    // search
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");//"i" flag: Case-insensitive search: Tìm kiếm không phân biệt chữ hoa chữ thường
        objectFind.title = regex;
    }
    //end search


    //pagination
    const page = parseInt(req.query.page) || 1;
    //console.log(page);

    const pageSize = 4; // Number of products per page
    if (req.query.limit)
        pageSize = parseInt(req.query.limit);

    const skip = (page - 1) * pageSize;// bắt đầu từ vị trí 0 trong database    
    //end pagination



    // Count total products
    const totalProducts = await ProductModel.countDocuments(objectFind);
    const totalPages = Math.ceil(totalProducts / pageSize);

    // Fetch products for the current page
    const danhSachSanPham = await ProductModel
        .find(objectFind)
        .skip(skip)
        .limit(pageSize)
        .sort({
            position: -1,
            title: 1,
            price: -1
        });
    //console.log('test xem có danh sách sản phẩm không: ',danhSachSanPham);

    res.render('admin/pages/products/index', {
        pageTitle: 'Trang product của admin',
        danhSachVer2: danhSachSanPham,
        currentPage: page,
        totalPage: totalPages
    });
};


module.exports.changeStatus = async (req, res) => {
    //req: FE send to BE
    //res: BE response to FE


    //console.log('ok vào change status BE');
    //console.log(req.body);

    try {
        // Update the product's status based on the provided ID
        await ProductModel.updateOne(
            { _id: req.body.id }, // Query: find product by ID
            { status: req.body.status } // Update: set the new status
        );

        // Send success response to the frontend
        res.json({
            code: "success",// want to reload page to update new status in DB
            message: "Đổi trạng thái thành công!"
        });

    } catch (error) {
        // Handle any errors that may occur during the update process
        console.error('Error changing status:', error);
        res.status(500).json({
            code: "error",
            message: "Đã xảy ra lỗi khi đổi trạng thái!"
        });
    }
};



module.exports.changeStatusForMultiple = async (req, res) => {
    try {
        const { ids, status } = req.body;

        if (!ids || ids.length === 0) {
            return res.status(400).json({
                code: "error",
                message: "Không có sản phẩm nào được chọn!"
            });
        }

        switch (status) {
            case "delete":
                // Soft delete by setting `deleted` to true
                await ProductModel.updateMany(
                    { _id: { $in: ids } },
                    { deleted: true }
                );
                res.json({
                    code: "success",
                    message: "Các sản phẩm đã được xóa mềm thành công!"
                });
                break;

            case "active":
            case "inactive":
                // Update the status to active or inactive and ensure deleted is false if reactivated
                await ProductModel.updateMany(
                    { _id: { $in: ids } },
                    { status: status, deleted: false }
                );
                res.json({
                    code: "success",
                    message: `Đổi trạng thái thành công cho nhiều sản phẩm thành ${status}!`
                });
                break;

            default:
                res.status(400).json({
                    code: "error",
                    message: "Trạng thái không hợp lệ!"
                });
                break;
        }
    } catch (error) {
        console.error('Error changing status for multiple products:', error);
        res.status(500).json({
            code: "error",
            message: "Đã xảy ra lỗi khi đổi trạng thái cho nhiều sản phẩm!"
        });
    }
};




module.exports.deleteProduct = async (req, res) => {
    try {
        // Extract product ID from the request params
        //const productId = req.params.id;
        //console.log(productId);



        // Soft delete: Update the 'deleted' field to true
        // await ProductModel.updateOne(
        //     { _id: productId },
        //     { deleted: true }
        // );


        // Get product IDs from the query params, split them into an array
        const productIds = req.params.ids.split(',');


        // Soft delete all products by setting `deleted` to true for the provided IDs
        await ProductModel.updateMany(
            { _id: { $in: productIds } }, // Match products with these IDs
            { deleted: true } // Set `deleted` to true
        );

        // Send success response to the frontend
        res.json({
            code: "success",
            message: "Xóa sản phẩm thành công!"
        });

    } catch (error) {
        // Handle any errors during the deletion process
        console.error('Error deleting product:', error);
        res.status(500).json({
            code: "error",
            message: "Đã xảy ra lỗi khi xóa sản phẩm!"
        });
    }
};



module.exports.getDeletedProducts = async (req, res) => {
    try {
        // Fetch all products that are soft deleted
        const deletedProducts = await ProductModel.find({ deleted: true });

        // Respond with the list of deleted products
        res.json({
            code: "success",
            data: deletedProducts
        });
    } catch (error) {
        console.error('Error fetching deleted products:', error);
        res.status(500).json({
            code: "error",
            message: "Đã xảy ra lỗi khi lấy danh sách sản phẩm đã xóa!"
        });
    }
};


module.exports.restoreProduct = async (req, res) => {
    try {
        //const productId = req.params.id;
        const productIds = req.params.ids.split(',');

        // Set deleted to false to restore the product
        await ProductModel.updateMany(
            { _id: { $in: productIds } }, // Match products with these IDs
            { deleted: false }
        );

        res.json({
            code: "success",
            message: "Sản phẩm đã được khôi phục!"
        });
    } catch (error) {
        console.error('Error restoring product:', error);
        res.status(500).json({
            code: "error",
            message: "Đã xảy ra lỗi khi khôi phục sản phẩm!"
        });
    }
};


module.exports.changePosition = async (req, res) => {
    try {
        const { id, position } = req.body;

        // Validation check
        if (!id || position == null) {
            return res.status(400).json({
                code: "error",
                message: "Invalid input data!"
            });
        }

        // Update operation
        await ProductModel.updateOne(
            { _id: id },
            { position: position }
        );

        res.json({
            code: "success",
            message: "Đổi vị trí thành công!"
        });
    } catch (error) {
        console.error("Error updating position:", error);
        res.status(500).json({
            code: "error",
            message: "Có lỗi xảy ra, vui lòng thử lại!"
        });
    }
};
