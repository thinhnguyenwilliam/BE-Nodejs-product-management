const ProductModel = require('../../models/product.model');
const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const moment = require("moment");
const Account = require("../../models/account.model");

module.exports.viewProduct = async (req, res) => {


    // Filter
    const objectFind = { deleted: false };

    if (req.query.status) objectFind.status = req.query.status;

    // Search
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i"); // Case-insensitive search
        objectFind.title = regex;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    let pageSize = 4; // Default number of products per page
    if (req.query.limit) pageSize = parseInt(req.query.limit);
    const skip = (page - 1) * pageSize;

    // Multi-Field Sorting
    let sort = {};
    if (req.query.sortBy) {
        const sortFields = req.query.sortBy.split(','); // Split by comma to allow multiple fields
        const sortOrders = req.query.sortOrder ? req.query.sortOrder.split(',') : []; // Split sortOrder if provided

        sortFields.forEach((field, index) => {
            const order = sortOrders[index] === 'asc' ? 1 : -1; // Default to descending if not specified
            sort[field] = order;
        });
    } else {
        // Default sorting
        sort = { position: -1, title: 1, price: -1 };
    }

    try {
        // Count total products
        const totalProducts = await ProductModel.countDocuments(objectFind);
        const totalPages = Math.ceil(totalProducts / pageSize);

        // Fetch products for the current page
        const products = await ProductModel
            .find(objectFind)
            .skip(skip)
            .limit(pageSize)
            .sort(sort);


        // Fetch account details for `createdBy`
        const createdByIds = products.map((item) => item.createdBy);
        const accounts = await Account.find({ _id: { $in: createdByIds } });
        const accountMap = accounts.reduce((map, account) => {
            map[account._id] = account.fullName;
            return map;
        }, {});

        // Enrich product data
        const enrichedProducts = products.map((item) => {
            return {
                ...item._doc,
                createdByFullName: accountMap[item.createdBy] || "",
                createdAtFormat: item.createdAt
                    ? moment(item.createdAt).format("HH:mm - DD/MM/YY")
                    : "",
            };
        });

        // Return JSON response
        res.json({
            success: true,
            message: "Products fetched successfully",
            data: {
                enrichedProducts,
                pagination: {
                    currentPage: page,
                    totalPages,
                    pageSize,
                    totalProducts,
                }
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
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

        req.flash('success', 'Đổi trạng thái thành công!');
        // Send success response to the frontend
        res.json({
            code: "success",// want to reload page to update new status in DB
        });

    } catch (error) {
        // Handle any errors that may occur during the update process
        req.flash('error', 'Update failed.');
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
                req.flash('success', 'Các sản phẩm đã được xóa mềm thành công!');
                res.json({
                    code: "success",
                });
                break;

            case "active":
            case "inactive":
                // Update the status to active or inactive and ensure deleted is false if reactivated
                await ProductModel.updateMany(
                    { _id: { $in: ids } },
                    { status: status, deleted: false }
                );
                req.flash('success', `Đổi trạng thái thành công cho nhiều sản phẩm thành ${status}!`);
                res.json({
                    code: "success",
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

        req.flash('success', `Xóa sản phẩm thành công! ${productIds}!`);
        // Send success response to the frontend
        res.json({
            code: "success",
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
        req.flash('success', 'Đổi vị trí thành công!');
        res.json({
            code: "success",
        });
    } catch (error) {
        console.error("Error updating position:", error);
        res.status(500).json({
            code: "error",
            message: "Có lỗi xảy ra, vui lòng thử lại!"
        });
    }
};



module.exports.create = async (req, res) => {
    const listCategory = await ProductCategory.find({
        deleted: false
    });

    res.render("admin/pages/products/create", { //render following folder architect not URI
        pageTitle: "Thêm mới sản phẩm",
        listCategory: listCategory
    });
}




module.exports.createPost = async (req, res) => {
    //console.log(req.body);
    try {

        if (!req.role || !Array.isArray(req.role.permissions) || !req.role.permissions.includes("write")) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You do not have the required permissions to perform this action.",
            });
        }


        // Parse and validate input data
        const position = req.body.position
            ? parseInt(req.body.position)
            : await ProductModel.countDocuments() + 1;

        const parsedData = {
            ...req.body,
            price: parseInt(req.body.price),
            discountPercentage: parseInt(req.body.discountPercentage),
            stock: parseInt(req.body.stock),
            position,
            createdBy: req.user.id, // Add createdBy from the authenticated user
        };


        const record = new ProductModel(parsedData);
        await record.save();

        res.redirect(`/${systemConfig.prefixAdmin}/products`);// response json like this url
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send("Internal Server Error");
    }
};

///

module.exports.edit = async (req, res) => {
    const id = req.params.id;
    //console.log(req.params);
    //console.log(id);
    const product = await ProductModel.findOne({ _id: id, deleted: false });
    //console.log(product);

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product
    });
};
//

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    try {
        // Destructure and parse specific fields, and capture the rest
        const {
            price,
            discountPercentage,
            stock,
            position
        } = req.body;


        // Parse numeric fields
        const updateData = {
            ...req.body,
            price: parseInt(price),
            discountPercentage: parseInt(discountPercentage),
            stock: parseInt(stock),
            position: position ? parseInt(position) : undefined
        };


        await ProductModel.updateOne(
            {
                _id: id,
                deleted: false
            }
            , updateData
        );

        req.flash("success", "Cập nhật thành công!");
        res.redirect(req.get("Referrer") || "/");
    } catch (error) {
        console.error("Error updating product:", error);
        req.flash("error", "Đã xảy ra lỗi khi cập nhật sản phẩm.");
        res.redirect(req.get("Referrer") || "/");
    }
};


module.exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await ProductModel.findOne({ _id: id, deleted: false });
        if (!product) {
            return res.status(404).render("admin/pages/products/not-found", {
                pageTitle: "Sản phẩm không tồn tại"
            });
        }
        res.render("admin/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("admin/pages/products/error", {
            pageTitle: "Lỗi hệ thống"
        });
    }
}
