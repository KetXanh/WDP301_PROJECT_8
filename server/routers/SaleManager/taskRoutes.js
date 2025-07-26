const express = require("express");
const router = express.Router();
const taskController = require("../../controller/SaleManager/taskController");
const authMiddleware = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/auth");

// Task management routes
router.post("/create-task", authMiddleware.authenticateToken, authorizeRoles(2), taskController.createTask);
router.get("/get-tasks", taskController.getTasks);
router.get("/stats", taskController.getTaskStats);
router.get("/get-task/:id", taskController.getTaskById);
router.put("/update-task/:id", authMiddleware.authenticateToken, authorizeRoles(2), taskController.updateTask);
router.delete("/delete-task/:id", authMiddleware.authenticateToken, authorizeRoles(2), taskController.deleteTask);

// User management routes
router.get("/getAllUsers", taskController.getAllUsers);
router.get("/getAllSaleStaff", taskController.getAllSaleStaff);

module.exports = router;
