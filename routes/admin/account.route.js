const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/account.controller");




router.get("/", controller.ViewAllAccounts);
router.get("/create", controller.create);
router.post( "/create",controller.createPost);



router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);

router.get("/change-password/:id", controller.changePassword);
router.patch("/change-password/:id", controller.changePasswordPatch);

module.exports = router;