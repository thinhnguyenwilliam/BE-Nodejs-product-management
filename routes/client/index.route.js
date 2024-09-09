// Use the routes defined in product.route.js
const productRoutes = require('./product.route');

const homeRoutes = require('./home.route');



module.exports = (app) => {
    app.use('/',homeRoutes);


    // All routes under '/products' will be handled by productRoutes
    app.use('/products', productRoutes);  
}