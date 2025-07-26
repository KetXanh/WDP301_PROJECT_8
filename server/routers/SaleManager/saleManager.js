const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth")
const controller = require("../../controller/SaleManager/SaleManager");
const { authorizeRoles } = require("../../middleware/auth");
const { getProfile } = require('../../controller/SaleManager/SaleManager');

router.get("/getAllSaleManager", controller.getAllSaleManager);
router.put("/changeRole/:id", Authozation.authenticateToken, authorizeRoles(2), controller.changeRole);
router.get('/profile', Authozation.authenticateToken, getProfile);
router.get("/users", controller.getAllUsers);
router.get("/users/stats", controller.getUserStats);

module.exports = router;

