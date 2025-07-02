const express = require('express');
const router = express.Router();
const blogController = require('../../controller/AdminDev/blog');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');

// Tạo blog mới (chỉ role 2)
router.post('/', authenticateToken, authorizeRoles(2), blogController.createBlog);

// Lấy danh sách blog (ai cũng xem được)
router.get('/', blogController.getBlogs);

// Lấy chi tiết blog (ai cũng xem được)
router.get('/:id', blogController.getBlogDetail);

// Cập nhật blog (chỉ cần xác thực)
router.put('/:id', authenticateToken, authorizeRoles(2), blogController.updateBlog);

// Xóa blog (chỉ cần xác thực)
router.delete('/:id', authenticateToken, authorizeRoles(2), blogController.deleteBlog);

// Thêm comment cho blog (chỉ cần xác thực)
router.post('/:id/comments', authenticateToken, blogController.addComment);

// Cập nhật comment
router.put('/:blogId/comments/:commentId', authenticateToken, blogController.updateComments);

// Xóa comment khỏi blog (chỉ cần xác thực)
router.delete('/:blogId/comments/:commentId', authenticateToken, blogController.deleteComment);

module.exports = router;
