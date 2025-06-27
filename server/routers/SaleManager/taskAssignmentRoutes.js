const express = require("express");
const router = express.Router();
const taskAssignmentController = require("../../controller/SaleManager/taskAssignmentController");
const authMiddleware = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/auth");

// Task assignment routes
router.post("/assign", authMiddleware.authenticateToken, authorizeRoles(2), taskAssignmentController.assignTask);
router.get("/assigned-tasks", taskAssignmentController.getAssignedTasks);
router.put("/update-status/:task", authMiddleware.authenticateToken, authorizeRoles(2), taskAssignmentController.updateTaskStatus);
router.delete("/remove/:task", authMiddleware.authenticateToken, authorizeRoles(2), taskAssignmentController.removeAssignment);
router.post("/assign-all", authMiddleware.authenticateToken, authorizeRoles(2), taskAssignmentController.assignTaskToAllStaff);

module.exports = router; 