const { Orders } = require("../../models/product/order");
const Users = require("../../models/user");
const OrderAssignment = require("../../models/sale/OrderAssignment");

exports.getAllOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            startDate,
            endDate,
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc"
        } = req.query;

        const skip = (page - 1) * limit;
        const query = {};

        // Filter theo status
        if (status) {
            query.status = status;
        }

        // Filter theo ngày
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // Search theo tên khách hàng hoặc email
        if (search) {
            // Tìm kiếm trong collection Users trước
            const users = await Users.find({
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');

            const userIds = users.map(user => user._id);
            query.user = { $in: userIds };
        }

        // Sort
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const orders = await Orders.find(query)
            .populate('user', 'username email phone')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        // Auto-update CASH orders with non-success paymentStatus to failed
        const cashOrdersToUpdate = orders.filter(order => 
            order.payment === "BANK" && 
            order.paymentStatus !== "success" && 
            order.status !== "failed"
        );

        if (cashOrdersToUpdate.length > 0) {
            const orderIdsToUpdate = cashOrdersToUpdate.map(order => order._id);
            await Orders.updateMany(
                { _id: { $in: orderIdsToUpdate } },
                { status: "failed" }
            );
            
            // Update the orders array with the new status
            orders.forEach(order => {
                if (orderIdsToUpdate.includes(order._id)) {
                    order.status = "failed";
                }
            });
        }

        const total = await Orders.countDocuments(query);

        // Tính tổng doanh thu
        const revenueResult = await Orders.aggregate([
            { $match: query },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        res.json(
            {
                code: 200,
                message: "Lấy danh sách đơn hàng thành công",
                data: {
                    orders,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / limit),
                        totalItems: total,
                        itemsPerPage: parseInt(limit)
                    },
                    summary: {
                        totalRevenue,
                        totalOrders: total
                    }
                }
            });
    } catch (error) {
        console.error('Error in getAllOrders:', error);
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

// Lấy chi tiết đơn hàng
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.json({ code: 400, message: "ID đơn hàng là bắt buộc" });
        }

        const order = await Orders.findById(id)
            .populate({
                path: 'user',
                select: 'username email phone address'
            })
            .populate({
                path: 'items.product',
                populate: {
                    path: 'baseProduct',
                    model: 'BaseProduct'
                }
            });

        if (!order) {
            return res.json({ code: 404, message: "Không tìm thấy đơn hàng" });
        }

        // Auto-update CASH orders with non-success paymentStatus to failed
        if (order.payment === "BANK" && order.paymentStatus !== "success" && order.status !== "failed") {
            await Orders.findByIdAndUpdate(order._id, { status: "failed" });
            order.status = "failed";
        }

        res.json({ code: 200, message: "Lấy chi tiết đơn hàng thành công", data: order });
    } catch (error) {
        console.error('Error in getOrderById:', error);
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!id) {
            return res.json({ code: 400, message: "ID đơn hàng là bắt buộc" });
        }

        if (!status) {
            return res.json({ code: 400, message: "Trạng thái là bắt buộc" });
        }

        const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
        if (!validStatuses.includes(status)) {
            return res.json({ code: 400, message: "Trạng thái không hợp lệ" });
        }   

        const order = await Orders.findById(id);
        if (!order) {
            return res.json({ code: 404, message: "Không tìm thấy đơn hàng" });
        }

        // Cập nhật trạng thái và ghi chú
        const updateData = { status };
        if (notes) {
            updateData.notes = notes;
        }

        const updatedOrder = await Orders.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('user', 'username email phone');

        res.json({ code: 200, message: "Cập nhật trạng thái đơn hàng thành công", data: updatedOrder });
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

// Xóa đơn hàng 
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.json({ code: 400, message: "ID đơn hàng là bắt buộc" });
        }

        const order = await Orders.findById(id);
        if (!order) {
            return res.json({ code: 404, message: "Không tìm thấy đơn hàng" });
        }

        // Chỉ cho phép xóa đơn hàng có trạng thái pending hoặc cancelled
        if (!["pending", "cancelled"].includes(order.status)) {
            return res.json({ code: 400, message: "Chỉ có thể xóa đơn hàng có trạng thái pending hoặc cancelled" });
        }

        await Orders.findByIdAndDelete(id);

        res.json({ code: 200, message: "Xóa đơn hàng thành công" });
    } catch (error) {
        console.error('Error in deleteOrder:', error);
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

// ==================== ORDER ASSIGNMENT MANAGEMENT ====================

// Gán đơn hàng cho nhân viên
exports.assignOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo, notes, priority = 'medium' } = req.body;

        if (!id) {
            return res.json({ code: 400, message: "ID đơn hàng là bắt buộc" });
        }

        if (!assignedTo) {
            return res.json({ code: 400, message: "ID nhân viên được gán là bắt buộc" });
        }

        // Kiểm tra đơn hàng tồn tại
        const order = await Orders.findById(id);
        if (!order) {
            return res.json
        }

        // Kiểm tra đơn hàng đã được gán chưa
        const existingAssignment = await OrderAssignment.findOne({ orderId: id });
        if (existingAssignment) {
            return res.status(400).json({
                success: false,
                message: "Đơn hàng đã được gán cho nhân viên khác"
            });
        }

        // Kiểm tra nhân viên tồn tại và có role Sale Staff
        const staff = await Users.findOne({ _id: assignedTo, role: 4 });
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân viên bán hàng"
            });
        }

        const user = await Users.findOne({ email: req.user.email });

        // Tạo assignment mới
        const assignment = new OrderAssignment({
            orderId: id,
            assignedTo,
            assignedBy: user._id,
            notes,
            priority
        });

        await assignment.save();

        // Cập nhật status đơn hàng thành processing
        const updatedOrder = await Orders.findByIdAndUpdate(
            id,
            { status: "processing" },
            { new: true }
        ).populate('user', 'username email phone');

        // Populate thông tin assignment
        const populatedAssignment = await OrderAssignment.findById(assignment._id)
            .populate("assignedTo", "username email");

        res.status(200).json({
            success: true,
            message: "Gán đơn hàng thành công",
            data: {
                order: updatedOrder,
                assignment: populatedAssignment
            }
        });
    } catch (error) {
        console.error('Error in assignOrder:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

// Tạo assignment mới (API riêng)
exports.createOrderAssignment = async (req, res) => {
    try {
        const { orderId, assignedTo, notes, priority = 'medium' } = req.body;

        // Validation
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "ID đơn hàng là bắt buộc"
            });
        }

        if (!assignedTo) {
            return res.status(400).json({
                success: false,
                message: "ID nhân viên được gán là bắt buộc"
            });
        }

        // Kiểm tra đơn hàng tồn tại
        const order = await Orders.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng"
            });
        }

        // Kiểm tra đơn hàng đã được gán chưa
        const existingAssignment = await OrderAssignment.findOne({ orderId });
        if (existingAssignment) {
            return res.status(400).json({
                success: false,
                message: "Đơn hàng đã được gán cho nhân viên khác"
            });
        }

        // Kiểm tra nhân viên tồn tại và có role Sale Staff
        const staff = await Users.findOne({ _id: assignedTo, role: 4 });
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân viên bán hàng"
            });
        }

        // Tạo assignment mới
        const assignment = new OrderAssignment({
            orderId,
            assignedTo,
            assignedBy: req.user.id,
            notes,
            priority
        });

        await assignment.save();

        // Populate thông tin
        const populatedAssignment = await OrderAssignment.findById(assignment._id)
            .populate("orderId", "totalAmount status createdAt")
            .populate("assignedTo", "username email");

        res.status(201).json({
            success: true,
            message: "Gán đơn hàng thành công",
            data: populatedAssignment
        });
    } catch (error) {
        console.error('Error in createOrderAssignment:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

// Lấy danh sách assignment với filter
exports.getOrderAssignments = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            assignedTo,
            priority,
            startDate,
            endDate,
            sortBy = "assignedAt",
            sortOrder = "desc"
        } = req.query;

        const skip = (page - 1) * limit;
        const query = {};

        // Filter theo status
        if (status) {
            query.status = status;
        }

        // Filter theo nhân viên được gán
        if (assignedTo) {
            query.assignedTo = assignedTo;
        }

        // Filter theo priority
        if (priority) {
            query.priority = priority;
        }

        // Filter theo ngày
        if (startDate || endDate) {
            query.assignedAt = {};
            if (startDate) {
                query.assignedAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.assignedAt.$lte = new Date(endDate);
            }
        }

        // Sort
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const assignments = await OrderAssignment.find(query)
            .populate("orderId", "totalAmount status createdAt user")
            .populate("assignedTo", "username email")
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await OrderAssignment.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Lấy danh sách gán đơn hàng thành công",
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
        console.error('Error in getOrderAssignments:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

// Lấy chi tiết assignment
exports.getOrderAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID assignment là bắt buộc"
            });
        }

        const assignment = await OrderAssignment.findById(id)
            .populate("orderId", "totalAmount status createdAt user items")
            .populate("assignedTo", "username email phone");

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy assignment"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lấy chi tiết assignment thành công",
            data: assignment
        });
    } catch (error) {
        console.error('Error in getOrderAssignmentById:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

// Cập nhật status assignment
exports.updateOrderAssignmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!id) {
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

        const assignment = await OrderAssignment.findById(id);
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
            id,
            updateData,
            { new: true }
        ).populate("orderId", "totalAmount status createdAt")
            .populate("assignedTo", "username email");

        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái assignment thành công",
            data: updatedAssignment
        });
    } catch (error) {
        console.error('Error in updateOrderAssignmentStatus:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

// Xóa assignment
exports.deleteOrderAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID assignment là bắt buộc"
            });
        }

        const assignment = await OrderAssignment.findById(id);
        if (!assignment) {
            return res.json({ code: 404, message: "Không tìm thấy assignment" });
        }

        // Chỉ cho phép xóa assignment có status pending
        if (assignment.status !== 'pending') {
            return res.json({ code: 400, message: "Chỉ có thể xóa assignment có trạng thái pending" });
        }

        await OrderAssignment.findByIdAndDelete(id);

        res.json({ code: 200, message: "Xóa assignment thành công" });
    } catch (error) {
        console.error('Error in deleteOrderAssignment:', error);
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

// Lấy assignment theo sale staff
exports.getAssignmentsByStaff = async (req, res) => {
    try {
        const { staffId } = req.params;
        const {
            page = 1,
            limit = 10,
            status
        } = req.query;

        const skip = (page - 1) * limit;
        const query = { assignedTo: staffId };

        if (status) {
            query.status = status;
        }

        // Kiểm tra staff tồn tại và có role Sale Staff (role = 4)
        const staff = await Users.findById(staffId);
        if (!staff) {
            return res.json({ code: 404, message: "Không tìm thấy nhân viên bán hàng" });
        }

        if (staff.role !== 4) {
            return res.json({ code: 400, message: "Người dùng này không phải là nhân viên bán hàng" });
        }

        const assignments = await OrderAssignment.find(query)
            .populate({
                path: "orderId",
                select: "totalAmount status createdAt",
                populate: {
                    path: "user",
                    select: "username email phone"
                }
            })
            .populate("assignedTo", "username email")
            .sort({ assignedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await OrderAssignment.countDocuments(query);

        res.json({
            code: 200, message: "Lấy danh sách assignment theo nhân viên thành công",
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
        console.error('Error in getAssignmentsByStaff:', error);
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

// Lấy thống kê đơn hàng
exports.getOrderStatistics = async (req, res) => {
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

        // Thống kê theo trạng thái
        const statusStats = await Orders.aggregate([
            { $match: query },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Thống kê theo ngày
        const dailyStats = await Orders.aggregate([
            { $match: query },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Tổng doanh thu
        const revenueResult = await Orders.aggregate([
            { $match: query },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Tổng số đơn hàng
        const totalOrders = await Orders.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Lấy thống kê đơn hàng thành công",
            data: {
                statusStats,
                dailyStats,
                summary: {
                    totalOrders,
                    totalRevenue
                }
            }
        });
    } catch (error) {
        console.error('Error in getOrderStatistics:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
}; 

// Gán tất cả đơn hàng đang chờ cho nhân viên bán hàng (chia đều)
exports.assignAllOrdersToStaff = async (req, res) => {
    try {
        // Lấy tất cả đơn hàng đang chờ xử lý (pending) chưa được gán
        const pendingOrders = await Orders.find({ status: "pending" });
        if (!pendingOrders.length) {
            return res.status(400).json({ success: false, message: "Không có đơn hàng chờ xử lý" });
        }
        
        // Lấy tất cả nhân viên bán hàng
        const saleStaff = await Users.find({ role: 4 });
        if (!saleStaff.length) {
            return res.status(400).json({ success: false, message: "Không có nhân viên bán hàng" });
        }
        
        // Lấy user thực hiện
        const user = await Users.findOne({ email: req.user.email });
        
        // Lọc ra những đơn hàng chưa được gán
        const unassignedOrders = [];
        for (const order of pendingOrders) {
            const existingAssignment = await OrderAssignment.findOne({ orderId: order._id });
            if (!existingAssignment) {
                unassignedOrders.push(order);
            }
        }
        
        if (!unassignedOrders.length) {
            return res.status(400).json({ success: false, message: "Tất cả đơn hàng đã được gán" });
        }
        
        // Tính toán workload hiện tại của từng nhân viên
        const staffWorkload = {};
        for (const staff of saleStaff) {
            const currentAssignments = await OrderAssignment.countDocuments({
                assignedTo: staff._id,
                status: { $in: ["pending", "processing"] }
            });
            staffWorkload[staff._id.toString()] = currentAssignments;
        }
        
        // Chia đều đơn hàng cho nhân viên (mỗi đơn chỉ gán cho 1 nhân viên)
        let assignedCount = 0;
        
        for (let i = 0; i < unassignedOrders.length; i++) {
            const order = unassignedOrders[i];
            
            // Tìm nhân viên có ít việc nhất
            let selectedStaff = saleStaff[0];
            let minWorkload = staffWorkload[selectedStaff._id.toString()];
            
            for (const staff of saleStaff) {
                const currentWorkload = staffWorkload[staff._id.toString()];
                if (currentWorkload < minWorkload) {
                    minWorkload = currentWorkload;
                    selectedStaff = staff;
                }
            }
            
            // Tạo assignment mới
            await OrderAssignment.create({
                orderId: order._id,
                assignedTo: selectedStaff._id,
                assignedBy: user._id,
                status: "pending"
            });
            
            // Cập nhật trạng thái đơn hàng thành processing
            await Orders.findByIdAndUpdate(order._id, { status: "processing" });
            
            // Cập nhật workload cho nhân viên được chọn
            staffWorkload[selectedStaff._id.toString()]++;
            assignedCount++;
        }
        
        const skippedCount = pendingOrders.length - unassignedOrders.length;
        const staffCount = saleStaff.length;
        const message = `Đã gán ${assignedCount} đơn hàng cho ${staffCount} nhân viên (phân phối theo workload).`;
        const detailMessage = skippedCount > 0 ? ` Bỏ qua ${skippedCount} đơn đã được gán trước đó.` : "";
        
        res.status(200).json({ 
            success: true, 
            message: message + detailMessage,
            data: {
                assignedCount,
                skippedCount,
                staffCount,
                totalOrders: pendingOrders.length,
                distribution: staffWorkload
            }
        });
    } catch (error) {
        console.error('Error in assignAllOrdersToStaff:', error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ", error: error.message });
    }
}; 