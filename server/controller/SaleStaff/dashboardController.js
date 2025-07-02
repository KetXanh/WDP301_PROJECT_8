const Users = require("../../models/user");
const Orders = require("../../models/product/order").Orders;
const TaskAssignment = require("../../models/sale/TaskAssignment");
const KPI = require("../../models/sale/KPI");

exports.getDashboardStats = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        const [orderCount, taskCount, kpiCount] = await Promise.all([
            Orders.countDocuments({ user: user._id }),
            TaskAssignment.countDocuments({ assignedTo: user._id }),
            KPI.countDocuments({ employeeId: user._id })
        ]);
        res.status(200).json({
            message: "Lấy thống kê dashboard thành công",
            stats: { orderCount, taskCount, kpiCount }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}; 