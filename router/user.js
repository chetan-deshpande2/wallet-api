const express = require("express");

const userController = require("../controller/userController");

router = express.Router();

router.post("/register", userController.register);

router.post("/email-activate", userController.activateEmail);
// router.post("/login", userController.login);

module.exports = router;
