const { body, validationResult } = require('express-validator');

const productValidationRules = [
    body('title')
        .notEmpty().withMessage("Tiêu đề không được để trống!")
        .isLength({ min: 5 }).withMessage("Tiêu đề ít nhất là 5 ký tự!"),
    // Add other product validation rules here as needed
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash("error", error.msg));
        res.redirect(req.get("Referrer") || "/");
        return;
    }
    next();
};

module.exports = {
    productValidationRules,
    validate
};
