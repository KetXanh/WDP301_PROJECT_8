const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require("../../controller/AdminDev/admin.controller");

router.put('/changeRole/:id', Authozation.authenticateToken, userController.changeRole);

module.exports = router;
