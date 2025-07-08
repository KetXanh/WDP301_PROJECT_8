const { Orders } = require("../../models/product/order");
const Users = require("../../models/user");
const OrderAssignment = require("../../models/sale/OrderAssignment");
const ProductBase = require("../../models/product/productBase");
const ProductVariant = require("../../models/product/ProductVariant");
// Lấy tất cả đơn hàng của sale staff hiện tại
exports.getMyOrders = async (req, res) => {
    try {
        const userLogin = req.user;
        const user = await Users.findOne({ email: userLogin.email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        const orders = await OrderAssignment.find({ assignedTo: user._id }).populate("orderId", "COD totalAmount status createdAt user items shippingAddress");
        res.status(200).json({ message: "Lấy danh sách đơn hàng thành công", orders });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

// Lấy chi tiết đơn hàng của chính mình
exports.getMyOrderById = async (req, res) => {
    try {
        const userLogin = req.user;
        const user = await Users.findOne({ email: userLogin.email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        const order = await OrderAssignment.findOne({ _id: req.params.id, assignedTo: user._id }).populate("orderId", "COD totalAmount status createdAt user items shippingAddress");
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        const productIds = order.orderId.items.map(item => item.product);
        const productVariants = await ProductVariant.find({ _id: { $in: productIds } });
        const baseProductIds = productVariants.map(variant => variant.baseProduct);
        const baseProducts = await ProductBase.find({ _id: { $in: baseProductIds } });
        const productDetail = productVariants.map(variant => {
            const orderItem = order.orderId.items.find(i => i.product.toString() === variant._id.toString());
            const baseProduct = baseProducts.find(bp => bp._id.toString() === variant.baseProduct.toString());
            return {
                product: baseProduct || null, 
                variant: variant,
                quantity: orderItem?.quantity,
                price: orderItem?.price
            };
        });

        res.status(200).json({ message: "Lấy chi tiết đơn hàng thành công", orderDetail: order.orderId, products: productDetail });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

// Cập nhật trạng thái đơn hàng của chính mình
exports.updateMyOrderStatus = async (req, res) => {
    try {
        const userLogin = req.user;
        const user = await Users.findOne({ email: userLogin.email });
        if (!user) return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        const { status } = req.body;
        const validStatuses = ["pending", "shipped", "delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Chỉ được cập nhật sang trạng thái 'shipped' hoặc 'delivered'" });
        }
        const order = await OrderAssignment.findOneAndUpdate(
            { _id: req.params.id, assignedTo: user._id },
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        res.status(200).json({ message: "Cập nhật trạng thái đơn hàng thành công", order });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

// Lấy danh sách đơn hàng được gán cho sale staff hiện tại
exports.getMyAssignedOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status
        } = req.query;

        const skip = (page - 1) * limit;

        // Tìm user hiện tại theo email
        const userLogin = req.user;
        const currentUser = await Users.findOne({ email: userLogin.email });
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin người dùng"
            });
        }

        const query = { assignedTo: currentUser._id };

        if (status) {
            query.status = status;
        }

        const assignments = await OrderAssignment.find(query)
            .populate("orderId", "COD totalAmount status createdAt user items")
            .sort({ assignedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await OrderAssignment.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Lấy danh sách đơn hàng được gán thành công",
            data: {
                assignments,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Error in getMyAssignedOrders:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

// Lấy chi tiết đơn hàng được gán
exports.getMyAssignedOrderDetail = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        if (!assignmentId) {
            return res.status(400).json({
                success: false,
                message: "ID assignment là bắt buộc"
            });
        }

        // Tìm user hiện tại theo email
        const userLogin = req.user;
        const currentUser = await Users.findOne({ email: userLogin.email });
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin người dùng"
            });
        }

        const assignment = await OrderAssignment.findOne({
            _id: assignmentId,
            assignedTo: currentUser._id
        })
            .populate("orderId", "COD totalAmount status createdAt user items shippingAddress");

        const product = await ProductBase.find({ _id: { $in: assignment.orderId.items } });
        const orderDetail = [assignment, product];
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng được gán"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lấy chi tiết đơn hàng thành công",
            data: orderDetail
        });
    } catch (error) {
        console.error('Error in getMyAssignedOrderDetail:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

// Cập nhật trạng thái xử lý đơn hàng
exports.updateOrderProcessingStatus = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { status, notes } = req.body;

        if (!assignmentId) {
            return res.status(400).json({
                success: false,
                message: "ID assignment là bắt buộc"
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái là bắt buộc"
            });
        }

        const validStatuses = ["pending", "processing", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái không hợp lệ"
            });
        }

        // Tìm user hiện tại theo email
        const userLogin = req.user;
        const currentUser = await Users.findOne({ email: userLogin.email });
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin người dùng"
            });
        }

        // Kiểm tra assignment thuộc về sale staff hiện tại
        const assignment = await OrderAssignment.findOne({
            _id: assignmentId,
            assignedTo: currentUser._id
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy assignment"
            });
        }

        // Cập nhật status và notes
        const updateData = { status };
        if (notes) {
            updateData.notes = notes;
        }

        // Nếu status là completed, thêm completedAt
        if (status === 'completed') {
            updateData.completedAt = new Date();
        }

        const updatedAssignment = await OrderAssignment.findByIdAndUpdate(
            assignmentId,
            updateData,
            { new: true }
        )
            .populate("orderId", "totalAmount status createdAt")
            .populate("assignedBy", "username");

        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái xử lý thành công",
            data: updatedAssignment
        });
    } catch (error) {
        console.error('Error in updateOrderProcessingStatus:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

// Lấy thống kê đơn hàng của sale staff
exports.getMyOrderStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userLogin = req.user;
        const currentUser = await Users.findOne({ email: userLogin.email });
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin người dùng"
            });
        }
        const query = { assignedTo: currentUser._id };

        if (startDate || endDate) {
            query.assignedAt = {};
            if (startDate) {
                query.assignedAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.assignedAt.$lte = new Date(endDate);
            }
        }

        // Thống kê theo trạng thái
        const statusStats = await OrderAssignment.aggregate([
            { $match: query },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Thống kê theo ngày
        const dailyStats = await OrderAssignment.aggregate([
            { $match: query },
            {
                $group: {
                    _id: {
                        year: { $year: "$assignedAt" },
                        month: { $month: "$assignedAt" },
                        day: { $dayOfMonth: "$assignedAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Tổng số assignment
        const totalAssignments = await OrderAssignment.countDocuments(query);

        // Số assignment hoàn thành
        const completedAssignments = await OrderAssignment.countDocuments({
            ...query,
            status: "completed"
        });

        // Tỷ lệ hoàn thành
        const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

        res.status(200).json({
            success: true,
            message: "Lấy thống kê đơn hàng thành công",
            data: {
                statusStats,
                dailyStats,
                summary: {
                    totalAssignments,
                    completedAssignments,
                    completionRate
                }
            }
        });
    } catch (error) {
        console.error('Error in getMyOrderStatistics:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
}; 