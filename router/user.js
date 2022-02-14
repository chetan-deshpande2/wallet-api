const express = require("express");

const userController = require("../controller/userController");

router = express.Router();

router.post("/register", userController.register);

module.exports = router;
