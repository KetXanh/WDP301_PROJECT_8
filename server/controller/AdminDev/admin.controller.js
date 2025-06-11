const User = require("../../models/user");
// const { Product } = require("../../models/product/product");

module.exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({}, '-password -re_token');

        res.status(200).json({
            message: "All users fetched successfully",
            users
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('subCategory')     // nếu muốn lấy thông tin chi tiết subCategory
            .populate('createdBy', 'username email'); // nếu muốn lấy người tạo sản phẩm

        res.status(200).json({
            message: "All products fetched successfully",
            products
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


module.exports.changeRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = req.user;

        // Kiểm tra phân quyền: chỉ role >= 1 (admin dev) mới được đổi vai trò
        if (!user || user.role < 1) {
            return res.status(403).json({
                message: "Access denied. Only admin can change roles."
            });
        }

        // Kiểm tra role hợp lệ
        const validRoles = [0, 1, 2, 3, 4];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role."
            });
        }
        // Kiểm tra user có tồn tại không
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        // Cập nhật role
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        res.status(200).json({
            message: "User role changed successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};