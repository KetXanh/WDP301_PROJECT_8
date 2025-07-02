const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/order')

router.post('/', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.userOrder);

module.exports = router;