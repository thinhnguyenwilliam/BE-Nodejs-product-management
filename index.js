require('dotenv').config();
const express = require('express');//  imports the Express module
const app = express();// initialize an Express application instance.


// Accessing environment variables
const port = process.env.PORT || 9999;


const dbHost = process.env.DB_HOST;
console.log(`Connecting to database at ${dbHost} từ file .env`);


// Connect to MongoDB
//lưu ý đặt tên collection(products) trong mongoDb
const mongoUrl = process.env.MONGO_URL;
console.log(`cái đường dẫn ${mongoUrl} từ file .env`);
const coSoDuLieu=require('./config/database');
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


//Start cấu hình routes
// Import the routes module
const routesClient = require('./routes/client/index.route');
routesClient(app);
//End cấu hình routes



// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port} nghe thành công`);
});




