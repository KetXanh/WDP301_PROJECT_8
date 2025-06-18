const express = require("express");
const router = express.Router();
const saleStaffController = require("../../controller/SaleStaff/saleStaff.controller");
const authMiddleware = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/auth");

router.get("/get-task-assignment", authMiddleware.authenticateToken, authorizeRoles(4), saleStaffController.getTaskAssignment);
router.put("/update-task-assignment/:taskAssignmentId", authMiddleware.authenticateToken, authorizeRoles(4), saleStaffController.updateTaskAssignment);

module.exports = router;