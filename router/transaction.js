const express = require("express");

const transactionController = require("../controller/transactionController");

router = express.Router();
router.post("/addFunds/", transactionController.addFund);
// router.post("/withdrawFunds/:id");
// router.post("/transferFunds/:id");

module.exports = router;