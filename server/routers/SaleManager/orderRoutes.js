const express = require("express");
const router = express.Router();
const orderController = require("../../controller/SaleManager/orderController");
const { authenticateToken, authorizeRoles } = require("../../middleware/auth");

// Middleware xác thực cho Sale Manager
const saleManagerAuth = [authenticateToken, authorizeRoles(2)];
// Lấy tất cả đơn hàng với pagination và filter
router.get("/", orderController.getAllOrders);

// Lấy chi tiết đơn hàng
router.get("/:id", saleManagerAuth, orderController.getOrderById);

// Cập nhật trạng thái đơn hàng
router.patch("/:id/status", saleManagerAuth, orderController.updateOrderStatus);

// Xóa đơn hàng
router.delete("/:id", saleManagerAuth, orderController.deleteOrder);

// Lấy thống kê đơn hàng
router.get("/statistics/orders", saleManagerAuth, orderController.getOrderStatistics);

// ==================== ORDER ASSIGNMENT ROUTES ====================

// Gán đơn hàng cho nhân viên
router.post("/:id/assign", saleManagerAuth, orderController.assignOrder);

// Tạo assignment mới
router.post("/assignment", saleManagerAuth, orderController.createOrderAssignment);

// Lấy danh sách assignment với filter
router.get("/assignment/list", orderController.getOrderAssignments);

// Lấy chi tiết assignment
router.get("/assignment/:id", orderController.getOrderAssignmentById);

// Cập nhật status assignment
router.patch("/assignment/:id/status", saleManagerAuth, orderController.updateOrderAssignmentStatus);

// Xóa assignment
router.delete("/assignment/:id", saleManagerAuth, orderController.deleteOrderAssignment);

// Lấy assignment theo sale staff
router.get("/assignment/staff/:staffId", orderController.getAssignmentsByStaff);

module.exports = router; 