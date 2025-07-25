const Users = require("../../models/user");
const Orders = require("../../models/product/order").Orders;
const TaskAssignment = require("../../models/sale/TaskAssignment");
const KPI = require("../../models/sale/KPI");
const OrderAssignment = require("../../models/sale/OrderAssignment");

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

exports.getDashboard = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.json({ code: 404, message: "Không tìm thấy người dùng" });

        // Get basic stats
        const [orderCount, taskCount, kpiCount] = await Promise.all([
            OrderAssignment.countDocuments({ assignedTo: user._id }),
            TaskAssignment.countDocuments({ assignedTo: user._id }),
            KPI.countDocuments({ employeeId: user._id })
        ]);

        // Get recent tasks
        const recentTasks = await TaskAssignment.find({ assignedTo: user._id })
            .populate('task')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent orders
        const recentOrders = await OrderAssignment.find({ assignedTo: user._id })
            .populate('orderId')
            .sort({ assignedAt: -1 })
            .limit(5);

        res.json({
            code: 200,
            message: "Lấy dữ liệu dashboard thành công",
            data: {
                stats: { orderCount, taskCount, kpiCount },
                recentTasks,
                recentOrders
            }
        });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.json({ code: 404, message: "Không tìm thấy người dùng" });

        const { period = 'month' } = req.query;
        
        // Calculate date range based on period
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        console.log('Analytics query for user:', user._id, 'period:', period, 'startDate:', startDate);

        // Get analytics data with simpler queries first
        const completedTasks = await TaskAssignment.countDocuments({ 
            assignedTo: user._id, 
            status: 'done',
            createdAt: { $gte: startDate }
        });

        const pendingTasks = await TaskAssignment.countDocuments({ 
            assignedTo: user._id, 
            status: { $in: ['pending', 'in-progress'] },
            createdAt: { $gte: startDate }
        });

        const completedOrders = await OrderAssignment.countDocuments({ 
            assignedTo: user._id,
            assignedAt: { $gte: startDate }
        });

        // Simplified revenue calculation
        const totalRevenue = await OrderAssignment.aggregate([
            { $match: { assignedTo: user._id, assignedAt: { $gte: startDate } } },
            { $lookup: { from: 'orders', localField: 'orderId', foreignField: '_id', as: 'order' } },
            { $unwind: '$order' },
            { $group: { _id: null, total: { $sum: '$order.totalAmount' } } }
        ]);

        const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

        console.log('Analytics results:', { completedTasks, pendingTasks, completedOrders, revenue });

        // Generate chart data for the period
        const chartData = {
            tasks: {
                completed: completedTasks,
                pending: pendingTasks,
                total: completedTasks + pendingTasks
            },
            orders: {
                completed: completedOrders,
                revenue: revenue
            }
        };

        res.json({
            code: 200,
            message: "Lấy dữ liệu analytics thành công",
            data: {
                stats: {
                    completedTasks,
                    pendingTasks,
                    completedOrders,
                    revenue
                },
                chartData
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
}; 