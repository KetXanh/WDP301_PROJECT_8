const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const controller = require("../../controller/SaleManager/SaleManager");
const { authorizeRoles } = require("../../middleware/auth");

router.get("/getAllSaleManager", controller.getAllSaleManager);
router.put("/changeRole/:id", Authozation.authenticateToken, authorizeRoles(2), controller.changeRole);

module.exports = router;

