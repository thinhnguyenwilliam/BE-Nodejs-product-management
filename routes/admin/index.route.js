const dashboardRoutes = require('./dashboard.route');
const productdRoutes = require('./product.route');
const productCategoryRoute = require("./product-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

const systemConfig = require('../../config/system');


module.exports = (app) => {
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.use(`${PATH_ADMIN}/dashboard`,
        authMiddleware.requireAuth,
        dashboardRoutes
    );

    app.use(`${PATH_ADMIN}/products`, authMiddleware.requireAuth, productdRoutes);
    app.use(`${PATH_ADMIN}/products-category`, authMiddleware.requireAuth, productCategoryRoute);
    app.use(`${PATH_ADMIN}/roles`, roleRoute);
    app.use(`${PATH_ADMIN}/accounts`, accountRoute);


    // Authentication routes (no auth middleware, as these are public endpoints)
    app.use(`${PATH_ADMIN}/auth`, authRoute);
}