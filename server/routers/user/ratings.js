const express = require('express');
const router = express.Router();
const Authozation = require("../../middleware/auth");
const controller = require('../../controller/User/rating')

router.post('/create', Authozation.authenticateToken, Authozation.authorizeRoles(0), controller.createRating)

module.exports = router;