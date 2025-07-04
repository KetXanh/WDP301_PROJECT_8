const Users = require("../../models/user");
const Orders = require("../../models/product/order").Orders;
const TaskAssignment = require("../../models/sale/TaskAssignment");
const KPI = require("../../models/sale/KPI");

exports.getDashboardStats = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        const [orderCount, taskCount, kpiCount] = await Promise.all([
            Orders.countDocuments({ user: user._id }),
            TaskAssignment.countDocuments({ assignedTo: user._id }),
            KPI.countDocuments({ employeeId: user._id })
        ]);
        res.json({
            code: 200,
            message: "Lấy thống kê dashboard thành công",
            data: { orderCount, taskCount, kpiCount }
        });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
}; 