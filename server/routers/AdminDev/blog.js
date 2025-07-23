const express = require('express');
const router = express.Router();
const blogController = require('../../controller/AdminDev/blog');
const Authozation = require("../../middleware/auth")

// Tạo blog mới 
router.post('/',Authozation.authenticateToken, Authozation.authorizeRoles(1), blogController.createBlog);

// Lấy danh sách blog (ai cũng xem được)
router.get('/', blogController.getBlogs);

// Lấy chi tiết blog (ai cũng xem được)
router.get('/:id', blogController.getBlogDetail);

// Cập nhật blog (chỉ cần xác thực)
router.put('/:id',Authozation.authenticateToken, Authozation.authorizeRoles(1), blogController.updateBlog);

// Xóa blog (chỉ cần xác thực)
router.delete('/:id',Authozation.authenticateToken, Authozation.authorizeRoles(1), blogController.deleteBlog);

// Thêm comment cho blog (chỉ cần xác thực)
router.post('/:id/comments',Authozation.authenticateToken, Authozation.authorizeRoles(1), blogController.addComment);

// Cập nhật comment
// router.put('/:blogId/comments',Authozation.authenticateToken, Authozation.authorizeRoles(1), blogController.updateComment);

// Xóa comment khỏi blog (chỉ cần xác thực)
router.delete('/:blogId/comments/:commentId',Authozation.authenticateToken, Authozation.authorizeRoles(1), blogController.deleteComment);

module.exports = router;
