const express = require('express');
const router = express.Router();
const discountController = require('../../controller/SaleManager/discountManager');

// Tạo mã giảm giá
router.post('/', discountController.createDiscount);
// Lấy tất cả mã giảm giá
router.get('/', discountController.getAllDiscounts);
// Lấy mã giảm giá theo id
router.get('/:id', discountController.getDiscountById);
// Cập nhật mã giảm giá
router.put('/:id', discountController.updateDiscount);
// Xóa mã giảm giá
router.delete('/:id', discountController.deleteDiscount);
// Kích hoạt/hủy kích hoạt mã giảm giá
router.patch('/:id/toggle', discountController.toggleDiscountActive);
// Áp dụng mã giảm giá (cho khách hàng)
router.post('/apply', discountController.applyDiscount);

module.exports = router; 