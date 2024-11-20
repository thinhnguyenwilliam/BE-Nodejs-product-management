const ProductCategory = require("../../models/product-category.model");

module.exports.viewPrductsCategory = async (req, res) => {
    try {
        //Check if the role has "read" permission
        if (!req.role.permissions.includes("read")) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You do not have the required permissions to perform this action.",
            });
        }


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



module.exports.edit = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await ProductCategory.findById(id);

        if (!category || category.deleted) {
            return res.status(404).json({
                success: false,
                message: "Product category not found or has been deleted",
            });
        }

        res.json({
            success: true,
            message: "Product category fetched successfully",
            data: category,
        });
    } catch (error) {
        console.error("Error fetching category for edit:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


module.exports.editPatch = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Ensure position is an integer if provided
        if (updates.position) {
            updates.position = parseInt(updates.position);
        }

        const updatedCategory = await ProductCategory.findByIdAndUpdate(
            id,
            updates,
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Product category not found",
            });
        }

        res.json({
            success: true,
            message: "Product category updated successfully",
            data: updatedCategory,
        });
    } catch (error) {
        console.error("Error updating product category:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


