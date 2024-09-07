const express = require('express');//  imports the Express module
const app = express();// initialize an Express application instance.
const port = 3000;

//Start PUG
// Set the view(template) engine to Pug
app.set('view engine', 'pug');

// Set the directory where the Pug templates are located
app.set('views', './views');
//End PUG


app.get('/', (req, res) => {
    res.render('client/pages/home/index');
});


app.get('/products', (req, res) => {
    res.render('client/pages/products/index');
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port} nghe thành công`);
});




