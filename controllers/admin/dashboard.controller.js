module.exports.viewPageAdmin = (req, res) => {
    res.render('admin/pages/dashboard/index',{
        pageTitle:'Trang tổng quan admin'
    });
};