const User = require("../../models/user");

module.exports.getAllSaleManager = async (req, res) => {
    try {
        const saleManager = await User.find({ role: 2 });
        res.json({ code: 200, message: "Lấy danh sách quản lý bán hàng thành công", data: saleManager });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
}

module.exports.changeRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!id || !role) {
            return res.json({ code: 400, message: "ID và vai trò là bắt buộc" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        }
        if (user.role < req.user.role) {
            return res.json({ code: 403, message: "Bạn không thể thay đổi vai trò của người dùng có quyền cao hơn" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role: Number(role) },
            { new: true }
        );
        if (!updatedUser) {
            return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        }
        res.json({ code: 200, message: "Cập nhật vai trò người dùng thành công", data: updatedUser });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
}
