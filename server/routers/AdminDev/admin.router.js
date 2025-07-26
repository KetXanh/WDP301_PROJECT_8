const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth");
const adminController = require("../../controller/AdminDev/adminController");

router.get('/getAllUser', adminController.getAllUser);
router.get('/export-users-excel', adminController.exportUsersToExcel);
router.get('/export-statistics-excel', adminController.exportStatisticsToExcel);
router.get('/export-feedback-excel', adminController.exportFeedbackToExcel);
router.get('/getAllProduct', adminController.getAllProduct);
router.get('/stats', adminController.getUserStats);
router.get('/blog-stats', adminController.getBlogStats);
router.put('/changeRole/:id',Authozation.authenticateToken ,Authozation.authorizeRoles(1), adminController.changeRole);
router.put('/updateProduct/:id', Authozation.authenticateToken, Authozation.authorizeRoles(1), adminController.updateProduct);
router.patch('/ban/:id', Authozation.authenticateToken, Authozation.authorizeRoles(1), adminController.banUser);
router.patch('/unban/:id', Authozation.authenticateToken, Authozation.authorizeRoles(1), adminController.unbanUser);

module.exports = router;
