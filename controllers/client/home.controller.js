module.exports.viewHome = (req, res) => {
    res.render('client/pages/home/index',{
        pageTitle:'Trang chủ'
    });
};