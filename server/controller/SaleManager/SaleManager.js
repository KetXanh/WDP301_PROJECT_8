const User = require("../../models/user");

module.exports.getAllSaleManager = async (req, res) => {
    try {
        const saleManager = await User.find({ role: 2 });
        res.status(200).json({
            message: "Lấy danh sách quản lý bán hàng thành công",
            saleManager
        })
    } catch (error) {
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        })
    }
}

module.exports.changeRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!id || !role) {
            return res.status(400).json({
                message: "ID và vai trò là bắt buộc"
            })
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            })
        }
        if (user.role < req.user.role) {
            return res.status(403).json({
                message: "Bạn không thể thay đổi vai trò của người dùng có quyền cao hơn"
            })
        }
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { role: Number(role) }, 
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            })
        }
        res.status(200).json({
            message: "Cập nhật vai trò người dùng thành công",
            user: updatedUser
        })
    } catch (error) {
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        })
    }
}
