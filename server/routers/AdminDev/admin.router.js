const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require("../../controller/AdminDev/admin.controller");

router.get('/getAllUser', controller.getAllUser);
router.get('/getAllProduct', controller.getAllProduct);
router.put('/changeRole/:id', Authozation.authenticateToken, controller.changeRole);

module.exports = router;
