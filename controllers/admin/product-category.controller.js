const ProductCategory = require("../../models/product-category.model");

module.exports.create = async (req, res) => {
    try {
        const listCategory = await ProductCategory.find({ deleted: false });

        res.json({
            success: true,
            message: "Categories fetched successfully for creation",
            data: listCategory,
        });
    } catch (error) {
        console.error("Error fetching categories for creation:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



module.exports.createPost = async (req, res) => {
    //console.log(req.body);

    try {
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            const countRecord = await ProductCategory.countDocuments();
            req.body.position = countRecord + 1;
        }

        const record = new ProductCategory(req.body);
        await record.save();

        res.json({
            success: true,
            message: "Product category created successfully",
            data: record,
        });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
