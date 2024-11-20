const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
    //console.log("cai token: ",req.cookies.token);

    try {
        if (!req.cookies.token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token is missing. Please log in.",
            });
        }

        const user = await Account.findOne({
            token: req.cookies.token,
            deleted: false,
            status: "active",
        });

        if (!user) {
            res.clearCookie("token");
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid or expired token.",
            });
        }

        // Find the role associated with the user's role_id
        const role = await Role.findOne({
            _id: user.role_id,
            deleted: false,
        });

        // If role is not found, send an error
        if (!role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Role not found.",
            });
        }

        // Attach the role object to the request
        req.role = role;
        //console.log('Role attached to req:', req.role);


        // Attach user to the request object if needed
        req.user = user;
        //console.log('User attached to req:', req.user); // Log user object

        next();
    } catch (err) {
        console.error("Error in authentication middleware:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};
