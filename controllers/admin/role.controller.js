const Role = require("../../models/role.model");

module.exports.index = async (req, res) => {
    try {
        const records = await Role.find({
            deleted: false
        });
        res.status(200).json({
            success: true,
            pageTitle: "Nhóm quyền",
            records: records
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching roles.",
            error: err.message
        });
    }
};

module.exports.create = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Endpoint for creating a new role is accessible."
    });
};

module.exports.createPost = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json({
            success: true,
            message: "Role created successfully",
            role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the role.",
            error: err.message
        });
    }
};



module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const role = await Role.findOne({
            _id: id,
            deleted: false
        });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Role retrieved successfully",
            role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the role.",
            error: err.message
        });
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        const updated = await Role.updateOne(
            { _id: id, deleted: false },
            req.body
        );

        if (updated.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Role not found or already deleted"
            });
        }

        res.status(200).json({
            success: true,
            message: "Role updated successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the role.",
            error: err.message
        });
    }
};


module.exports.permissions = async (req, res) => {
    try {
        const records = await Role.find({
            deleted: false
        });

        res.status(200).json({
            success: true,
            message: "Permissions retrieved successfully",
            records
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving permissions.",
            error: err.message
        });
    }
};

module.exports.permissionsPatch = async (req, res) => {
    try {
        const updates = req.body; // Assume this is an array of objects with `id` and `permissions`
        const updatePromises = updates.map(item =>
            Role.updateOne(
                { _id: item.id, deleted: false },
                { permissions: item.permissions }
            )
        );

        await Promise.all(updatePromises); // Execute updates in parallel

        res.status(200).json({
            success: true,
            message: "Permissions updated successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating permissions.",
            error: err.message
        });
    }
};

