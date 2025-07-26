const express = require("express");
const router = express.Router();
const taskAssignmentController = require("../../controller/SaleManager/taskAssignmentController");
const authMiddleware = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/auth");

// Task assignment routes
router.post("/assign", authMiddleware.authenticateToken, authorizeRoles(2), taskAssignmentController.assignTask);
router.get("/assigned-tasks", taskAssignmentController.getAssignedTasks);
router.get("/task/:taskId", taskAssignmentController.getTaskAssignments); // Lấy tất cả assignments cho một task
router.put("/update-status/:task", authMiddleware.authenticateToken, authorizeRoles(2), taskAssignmentController.updateTaskStatus);
router.delete("/remove/:task", authMiddleware.authenticateToken, authorizeRoles(2), taskAssignmentController.removeAssignment);
router.delete("/remove/:taskId/:userId", authMiddleware.authenticateToken, authorizeRoles(2), taskAssignmentController.removeSpecificAssignment); // Hủy gán task cho một user cụ thể
router.post("/assign-all", authMiddleware.authenticateToken, authorizeRoles(2), taskAssignmentController.assignTaskToAllStaff);
router.post("/assign-unassigned-to-all", authMiddleware.authenticateToken, authorizeRoles(2), taskAssignmentController.assignUnassignedTasksToAllStaff);


module.exports = router; 