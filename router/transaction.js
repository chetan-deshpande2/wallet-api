const express = require("express");

const transactionController = require("../controller/transactionController");


router = express.Router();
router.post("/addFunds", transactionController.addFundstoSelf);
router.post("/withdrawFunds", transactionController.transferFunds);
// router.post("/transferFunds/:id");

module.exports = router;