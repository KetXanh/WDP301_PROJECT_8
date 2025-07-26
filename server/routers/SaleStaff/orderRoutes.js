const express = require("express");
const router = express.Router();
const orderController = require("../../controller/SaleStaff/orderController");
const authMiddleware = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/auth");

// Lấy tất cả đơn hàng của chính mình
router.get("/", authMiddleware.authenticateToken, authorizeRoles(4), orderController.getMyOrders);
// Lấy thống kê đơn hàng của chính mình
router.get("/statistics", authMiddleware.authenticateToken, authorizeRoles(4), orderController.getMyOrderStatistics);
// Lấy chi tiết đơn hàng của chính mình
router.get("/:id", authMiddleware.authenticateToken, authorizeRoles(4), orderController.getMyOrderById);
// Cập nhật trạng thái đơn hàng của chính mình
router.put("/:id", authMiddleware.authenticateToken, authorizeRoles(4), orderController.updateMyOrderStatus);

module.exports = router; 