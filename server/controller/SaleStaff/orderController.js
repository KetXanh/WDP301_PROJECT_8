const { Orders } = require("../../models/product/order");
const Users = require("../../models/user");

// Lấy tất cả đơn hàng của sale staff hiện tại
exports.getMyOrders = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        const orders = await Orders.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ message: "Lấy danh sách đơn hàng thành công", orders });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

// Lấy chi tiết đơn hàng của chính mình
exports.getMyOrderById = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        const order = await Orders.findOne({ _id: req.params.id, user: user._id });
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        res.status(200).json({ message: "Lấy chi tiết đơn hàng thành công", order });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

// Cập nhật trạng thái đơn hàng của chính mình
exports.updateMyOrderStatus = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        const { status } = req.body;
        const validStatuses = ["shipped", "delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Chỉ được cập nhật sang trạng thái 'shipped' hoặc 'delivered'" });
        }
        const order = await Orders.findOneAndUpdate(
            { _id: req.params.id, user: user._id },
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        res.status(200).json({ message: "Cập nhật trạng thái đơn hàng thành công", order });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
}; 