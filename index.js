const express = require('express');//  imports the Express module
const app = express();// initialize an Express application instance.
const port = 3000;



app.get('/', (req, res) => {
    res.send('Trang chủ');
});


app.get('/products', (req, res) => {
    res.send('Trang danh sách sản phẩm');
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port} nghe thành công`);
});




