const { Orders } = require("../../models/product/order");
const Users = require("../../models/user");
const ProductsVariant = require("../../models/product/ProductVariant");
const ProductBase = require("../../models/product/productBase");
const Task = require("../../models/sale/Task");
const TaskAssignment = require("../../models/sale/TaskAssignment");

// Lấy thống kê tổng quan
module.exports.getStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // Thống kê đơn hàng
        const totalOrders = await Orders.countDocuments(query);
        const revenueResult = await Orders.aggregate([
            { $match: query },
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Thống kê theo trạng thái đơn hàng
        const orderStatusStats = await Orders.aggregate([
            { $match: query },
            { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } }
        ]);

        // Thống kê người dùng
        const totalUsers = await Users.countDocuments();
        const userRoleStats = await Users.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        // Thống kê doanh thu theo tháng
        const revenueByMonth = await Orders.aggregate([
            { $match: query },
            { 
                $group: { 
                    _id: { 
                        year: { $year: "$createdAt" }, 
                        month: { $month: "$createdAt" } 
                    }, 
                    totalRevenue: { $sum: "$totalPrice" },
                    orderCount: { $sum: 1 }
                } 
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Thống kê doanh thu theo năm
        const revenueByYear = await Orders.aggregate([
            { $match: query },
            { 
                $group: { 
                    _id: { year: { $year: "$createdAt" } }, 
                    totalRevenue: { $sum: "$totalPrice" },
                    orderCount: { $sum: 1 }
                } 
            },
            { $sort: { "_id.year": 1 } }
        ]);

        // Thống kê task
        const totalTasks = await Task.countDocuments();
        const taskStatusStats = await Task.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Thống kê task assignment
        const totalAssignments = await TaskAssignment.countDocuments();
        const assignmentStatusStats = await TaskAssignment.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            message: "Lấy thống kê tổng quan thành công",
            data: {
                orders: {
                    totalOrders,
                    totalRevenue,
                    statusStats: orderStatusStats,
                    revenueByMonth,
                    revenueByYear
                },
                users: {
                    totalUsers,
                    roleStats: userRoleStats
                },
                tasks: {
                    totalTasks,
                    statusStats: taskStatusStats
                },
                assignments: {
                    totalAssignments,
                    statusStats: assignmentStatusStats
                }
            }
        });
    } catch (error) {
        console.error('Error in getStatistics:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy thống kê sản phẩm
module.exports.getProductStatistics = async (req, res) => {
    try {
        const { startDate, endDate, categoryId } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        if (categoryId) {
            query.category = categoryId;
        }

        const products = await ProductsVariant.find(query).populate("baseProduct", "name description");
        const productBase = await ProductBase.find();

        // Thống kê sản phẩm theo tháng
        const productByMonth = await ProductsVariant.aggregate([
            { $match: query },
            { 
                $group: { 
                    _id: { 
                        year: { $year: "$createdAt" }, 
                        month: { $month: "$createdAt" } 
                    }, 
                    totalProducts: { $sum: 1 } 
                } 
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Thống kê sản phẩm theo năm
        const productByYear = await ProductsVariant.aggregate([
            { $match: query },
            { 
                $group: { 
                    _id: { year: { $year: "$createdAt" } }, 
                    totalProducts: { $sum: 1 } 
                } 
            },
            { $sort: { "_id.year": 1 } }
        ]);

        // Sản phẩm bán chạy nhất
        const mostPurchasedProduct = await ProductsVariant.aggregate([
            { $match: query },
            { $group: { _id: "$baseProduct", totalQuantity: { $sum: "$stock" } } },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "baseproduct",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" }
        ]);

        // Sản phẩm bán ít nhất
        const leastPurchasedProduct = await ProductsVariant.aggregate([
            { $match: query },
            { $group: { _id: "$baseProduct", totalQuantity: { $sum: "$stock" } } },
            { $sort: { totalQuantity: 1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "baseproduct",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" }
        ]);

        // Thống kê theo danh mục
        const categoryStats = await ProductsVariant.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "baseproduct",
                    localField: "baseProduct",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "productInfo.subCategory",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            { $unwind: "$categoryInfo" },
            {
                $group: {
                    _id: "$categoryInfo._id",
                    categoryName: { $first: "$categoryInfo.name" },
                    productCount: { $sum: 1 },
                    totalStock: { $sum: "$stock" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Lấy thống kê sản phẩm thành công",
            data: {
                products,
                productBase,
                productByMonth,
                productByYear,
                mostPurchasedProduct,
                leastPurchasedProduct,
                categoryStats
            }
        });
    } catch (error) {
        console.error('Error in getProductStatistics:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy thống kê đơn hàng
module.exports.getOrderStatistics = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        if (status) {
            query.status = status;
        }

        const orders = await Orders.find(query).populate("user", "username email");
        
        // Thống kê đơn hàng theo tháng
        const orderByMonth = await Orders.aggregate([
            { $match: query },
            { 
                $group: { 
                    _id: { 
                        year: { $year: "$createdAt" }, 
                        month: { $month: "$createdAt" } 
                    }, 
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" }
                } 
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Thống kê đơn hàng theo năm
        const orderByYear = await Orders.aggregate([
            { $match: query },
            { 
                $group: { 
                    _id: { year: { $year: "$createdAt" } }, 
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" }
                } 
            },
            { $sort: { "_id.year": 1 } }
        ]);

        // Thống kê theo trạng thái
        const statusStats = await Orders.aggregate([
            { $match: query },
            { 
                $group: { 
                    _id: "$status", 
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                } 
            }
        ]);

        // Thống kê theo ngày trong tuần
        const orderByDayOfWeek = await Orders.aggregate([
            { $match: query },
            { 
                $group: { 
                    _id: { $dayOfWeek: "$createdAt" }, 
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                } 
            },
            { $sort: { "_id": 1 } }
        ]);

        // Top khách hàng mua nhiều nhất
        const topCustomers = await Orders.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$user",
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: "$totalPrice" }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" }
        ]);

        const totalOrders = await Orders.countDocuments(query);
        const totalRevenue = await Orders.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        res.status(200).json({
            success: true,
            message: "Lấy thống kê đơn hàng thành công",
            data: {
                orders,
                orderByMonth,
                orderByYear,
                statusStats,
                orderByDayOfWeek,
                topCustomers,
                summary: {
                    totalOrders,
                    totalRevenue: totalRevenue[0]?.total || 0
                }
            }
        });
    } catch (error) {
        console.error('Error in getOrderStatistics:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy thống kê khách hàng
module.exports.getCustomerStatistics = async (req, res) => {
    try {
        const { startDate, endDate, role } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        if (role !== undefined) {
            query.role = parseInt(role);
        }

        const customers = await Users.find(query, "username email role createdAt");
        
        // Thống kê khách hàng theo tháng
        const customerByMonth = await Users.aggregate([
            { $match: query },
            { 
                $group: { 
                    _id: { 
                        year: { $year: "$createdAt" }, 
                        month: { $month: "$createdAt" } 
                    }, 
                    totalCustomers: { $sum: 1 } 
                } 
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Thống kê khách hàng theo năm
        const customerByYear = await Users.aggregate([
            { $match: query },
            { 
                $group: { 
                    _id: { year: { $year: "$createdAt" } }, 
                    totalCustomers: { $sum: 1 } 
                } 
            },
            { $sort: { "_id.year": 1 } }
        ]);

        // Thống kê theo vai trò
        const roleStats = await Users.aggregate([
            { $match: query },
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        // Khách hàng mới trong tháng hiện tại
        const currentMonth = new Date();
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const newCustomersThisMonth = await Users.countDocuments({
            ...query,
            createdAt: { $gte: firstDayOfMonth }
        });

        const totalCustomers = await Users.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Lấy thống kê khách hàng thành công",
            data: {
                customers,
                customerByMonth,
                customerByYear,
                roleStats,
                summary: {
                    totalCustomers,
                    newCustomersThisMonth
                }
            }
        });
    } catch (error) {
        console.error('Error in getCustomerStatistics:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy thống kê khách hàng trung thành
module.exports.getLoyalCustomer = async (req, res) => {
    try {
        const { minOrders = 3, minSpent = 1000000 } = req.query;

        // Tìm khách hàng có nhiều đơn hàng và chi tiêu cao
        const loyalCustomers = await Orders.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: "$totalPrice" },
                    averageOrderValue: { $avg: "$totalPrice" },
                    lastOrderDate: { $max: "$createdAt" },
                    firstOrderDate: { $min: "$createdAt" }
                }
            },
            {
                $match: {
                    totalOrders: { $gte: parseInt(minOrders) },
                    totalSpent: { $gte: parseInt(minSpent) }
                }
            },
            { $sort: { totalSpent: -1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            {
                $project: {
                    userId: "$_id",
                    username: "$userInfo.username",
                    email: "$userInfo.email",
                    totalOrders: 1,
                    totalSpent: 1,
                    averageOrderValue: 1,
                    lastOrderDate: 1,
                    firstOrderDate: 1,
                    customerSince: "$firstOrderDate"
                }
            }
        ]);

        // Thống kê tổng quan
        const totalLoyalCustomers = loyalCustomers.length;
        const totalRevenueFromLoyal = loyalCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
        const averageSpentPerLoyalCustomer = totalLoyalCustomers > 0 ? totalRevenueFromLoyal / totalLoyalCustomers : 0;

        res.status(200).json({
            success: true,
            message: "Lấy thống kê khách hàng trung thành thành công",
            data: {
                loyalCustomers,
                summary: {
                    totalLoyalCustomers,
                    totalRevenueFromLoyal,
                    averageSpentPerLoyalCustomer
                }
            }
        });
    } catch (error) {
        console.error('Error in getLoyalCustomer:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy thống kê KPI
module.exports.getKPIStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // Tổng doanh thu
        const revenueResult = await Orders.aggregate([
            { $match: query },
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Tổng đơn hàng
        const totalOrders = await Orders.countDocuments(query);

        // Đơn hàng thành công
        const successfulOrders = await Orders.countDocuments({
            ...query,
            status: { $in: ["delivered", "completed"] }
        });

        // Tỷ lệ hoàn thành đơn hàng
        const orderCompletionRate = totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;

        // Giá trị đơn hàng trung bình
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Khách hàng mới
        const newCustomers = await Users.countDocuments({
            ...query,
            role: 0 // Customer role
        });

        // Task hoàn thành
        const completedTasks = await Task.countDocuments({
            ...query,
            status: "done"
        });

        // Tổng task
        const totalTasks = await Task.countDocuments(query);

        // Tỷ lệ hoàn thành task
        const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        res.status(200).json({
            success: true,
            message: "Lấy thống kê KPI thành công",
            data: {
                revenue: {
                    totalRevenue,
                    averageOrderValue
                },
                orders: {
                    totalOrders,
                    successfulOrders,
                    orderCompletionRate
                },
                customers: {
                    newCustomers
                },
                tasks: {
                    totalTasks,
                    completedTasks,
                    taskCompletionRate
                }
            }
        });
    } catch (error) {
        console.error('Error in getKPIStatistics:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};