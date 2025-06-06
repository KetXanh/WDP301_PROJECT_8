const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const controller = require("../../controller/SaleManager/SaleManager");

router.get("/getAllSaleManager", controller.getAllSaleManager);
router.put("/changeRole/:id", Authozation.authenticateToken, controller.changeRole);

module.exports = router;

