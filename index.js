require('dotenv').config();
const express = require('express');//  imports the Express module
const session = require('express-session');
const flash = require('connect-flash');
const app = express();// initialize an Express application instance.
const systemConfig = require('./config/system');


// Accessing environment variables
const port = process.env.PORT || 9999;



// Connect to MongoDB
//lưu ý đặt tên collection(products) trong mongoDb
const mongoUrl = process.env.MONGO_URL;
//console.log(`cái đường dẫn ${mongoUrl} từ file .env`);
const coSoDuLieu = require('./config/database');
coSoDuLieu.connect();


// nhúng file tĩnh, cái trong thư muc public(hình ảnh,css,js)
// Serve static files from the "public" directory
app.use(express.static('public'));


//Start PUG
// Set the view(template) engine to Pug
app.set('view engine', 'pug');

// Set the directory where the Pug templates are located
app.set('views', './views');
//End PUG


// Define global variable
// prefixAdmin is a variable can use in PUG file
app.locals.prefixAdmin = systemConfig.prefixAdmin;


// parse application/json
app.use(express.json());


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));


// Configure express-session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Replace with a secure secret key
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize flash
app.use(flash());

// Middleware to make flash messages available in all templates
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});



//Start cấu hình routes
// Import the routes module -- admin, nhúng admin trước client, ưu tiên admin
const routesAdmin = require('./routes/admin/index.route');
routesAdmin(app);

// Import the routes module -- client
const routesClient = require('./routes/client/index.route');
routesClient(app);
//End cấu hình routes



// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port} nghe thành công`);
});




