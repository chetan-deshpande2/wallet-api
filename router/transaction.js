const express = require("express");

const transactionController = require("../controller/transactionController");
const transferFunds = require("../controller/transferFunds");

router = express.Router();
router.post("/addFunds", transactionController.addFund);
router.post("/withdrawFunds", transferFunds.transferFunds);
// router.post("/transferFunds/:id");

module.exports = router;