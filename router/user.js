const express = require("express");
const authAdmin = require("../middleware/authAdmin");

const userController = require("../controller/userController");

router = express.Router();

router.post("/register", userController.register);

router.post("/email-activate", userController.activateEmail);
router.post("/login", userController.login);
// router.post("/info", userController.getUserInfo);
router.get("/allinfo", userController.getAllUsersInfo);
router.post("/updaterole", userController.updateUserRole);

module.exports = router;
