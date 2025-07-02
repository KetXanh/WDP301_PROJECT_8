const express = require("express");
const router = express.Router();
const saleStaffController = require("../../controller/SaleStaff/saleStaff.controller");
const authMiddleware = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/auth");
const kpiController = require("../../controller/SaleStaff/kpiController");
const dashboardController = require("../../controller/SaleStaff/dashboardController");

router.get("/get-task-assignment", authMiddleware.authenticateToken, authorizeRoles(4), saleStaffController.getTaskAssignment);
router.put("/update-task-assignment/:taskAssignmentId", authMiddleware.authenticateToken, authorizeRoles(4), saleStaffController.updateTaskAssignment);

// KPI
router.get("/kpis", authMiddleware.authenticateToken, authorizeRoles(4), kpiController.getMyKPIs);
router.get("/kpis/:id", authMiddleware.authenticateToken, authorizeRoles(4), kpiController.getMyKPIById);
router.put("/kpis/:id", authMiddleware.authenticateToken, authorizeRoles(4), kpiController.updateMyKPI);

// Profile
router.get("/profile", authMiddleware.authenticateToken, authorizeRoles(4), saleStaffController.getProfile);
router.put("/profile", authMiddleware.authenticateToken, authorizeRoles(4), saleStaffController.updateProfile);
router.put("/change-password", authMiddleware.authenticateToken, authorizeRoles(4), saleStaffController.changePassword);

// Dashboard
router.get("/dashboard/stats", authMiddleware.authenticateToken, authorizeRoles(4), dashboardController.getDashboardStats);

module.exports = router;