const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth");
const adminController = require("../../controller/AdminDev/adminController");

router.get('/getAllUser', adminController.getAllUser);
router.get('/getAllProduct', adminController.getAllProduct);
router.put('/changeRole/:id', Authozation.authenticateToken, adminController.changeRole);
router.patch("/ban/:id", Authozation.authenticateToken, adminController.banUser);
router.patch("/unban/:id", Authozation.authenticateToken, adminController.unbanUser);
router.delete("/deleteUser/:id", Authozation.authenticateToken, adminController.deleteUser);
router.delete("/deleteProduct/:id", Authozation.authenticateToken, adminController.deleteProduct);
router.get('/stats', Authozation.authenticateToken, adminController.getUserStats);

module.exports = router;
