const express = require("express");
const router = express.Router();
const orderController = require("../../controller/SaleManager/orderController");
const authMiddleware = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/auth");

// Lấy tất cả đơn hàng
router.get("/orders", authMiddleware.authenticateToken, authorizeRoles(2), orderController.getAllOrders);
// Lấy chi tiết đơn hàng
router.get("/orders/:id", authMiddleware.authenticateToken, authorizeRoles(2), orderController.getOrderById);
// Cập nhật trạng thái đơn hàng
router.put("/orders/:id/status", authMiddleware.authenticateToken, authorizeRoles(2), orderController.updateOrderStatus);
// Gán đơn hàng cho nhân viên (tạm thời để trống hàm xử lý)
router.put("/orders/:id/assign", authMiddleware.authenticateToken, authorizeRoles(2), (req, res) => { res.status(501).json({ message: "Chức năng chưa triển khai" }); });
// Xóa đơn hàng
router.delete("/orders/:id", authMiddleware.authenticateToken, authorizeRoles(2), orderController.deleteOrder);

module.exports = router; 