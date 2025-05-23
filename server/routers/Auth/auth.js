const express = require("express");
const router = express.Router();
const controller = require('../../controller/Auth/login')
router.post('/login', controller.login);
router.post('/refresh-token', controller.refreshToken)
module.exports = router