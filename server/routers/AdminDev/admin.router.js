const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth");
const adminController = require("../../controller/AdminDev/adminController");

router.get('/getAllUser', adminController.getAllUser);
router.get('/getAllProduct', adminController.getAllProduct);
router.put('/changeRole/:id',Authozation.authenticateToken ,Authozation.authorizeRoles(1), adminController.changeRole);
router.patch("/ban/:id", adminController.banUser);
router.patch("/unban/:id", adminController.unbanUser);
router.delete("/deleteUser/:id", adminController.deleteUser);
router.delete("/deleteProduct/:id", adminController.deleteProduct);
router.get('/stats', adminController.getUserStats);

module.exports = router;
