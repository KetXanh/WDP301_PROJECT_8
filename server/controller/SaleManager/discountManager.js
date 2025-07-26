const Discount = require('../../models/product/discount');
const mongoose = require('mongoose');

// Tạo mã giảm giá mới
exports.createDiscount = async (req, res) => {
    try {
        const {
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            startDate,
            endDate,
            usageLimit,
            userUsageLimit,
            active
        } = req.body;
        const discount = new Discount({
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            startDate,
            endDate,
            usageLimit,
            userUsageLimit,
            active
        });
        await discount.save();
        res.status(201).json({ success: true, data: discount });
    } catch (error) {
        res.json({ code: 400, success: false, message: error.message });
    }
};

// Lấy tất cả mã giảm giá
exports.getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find();
        res.json({ success: true, data: discounts });
    } catch (error) {
        res.json({ code: 500, success: false, message: error.message });
    }
};

// Lấy mã giảm giá theo id
exports.getDiscountById = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) return res.status(404).json({ success: false, message: 'Discount not found' });
        res.json({ success: true, data: discount });
    } catch (error) {
        res.json({ code: 500, success: false, message: error.message });
    }
};

// Cập nhật mã giảm giá
exports.updateDiscount = async (req, res) => {
    try {
        const {
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            startDate,
            endDate,
            usageLimit,
            userUsageLimit,
            active
        } = req.body;
        const updateData = {    
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            startDate,
            endDate,
            usageLimit,
            userUsageLimit,
            active
        };
        // Xóa các trường undefined để tránh ghi đè giá trị cũ
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        const discount = await Discount.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!discount) return res.status(404).json({ success: false, message: 'Discount not found' });
        res.json({ success: true, data: discount });
    } catch (error) {
        res.json({ code: 400, success: false, message: error.message });
    }
};

// Xóa mã giảm giá
exports.deleteDiscount = async (req, res) => {
    try {
        const discount = await Discount.findByIdAndDelete(req.params.id);
        if (!discount) return res.status(404).json({ success: false, message: 'Discount not found' });
        res.json({ success: true, message: 'Discount deleted' });
    } catch (error) {
        res.json({ code: 500, success: false, message: error.message });
    }
};

// Kích hoạt/hủy kích hoạt mã giảm giá
exports.toggleDiscountActive = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) return res.status(404).json({ success: false, message: 'Discount not found' });
        discount.active = !discount.active;
        await discount.save();
        res.json({ success: true, data: discount });
    } catch (error) {
        res.json({ code: 500, success: false, message: error.message });
    }
};

// Áp dụng mã giảm giá (cho khách hàng)
exports.applyDiscount = async (req, res) => {
    try {
        const { code, userId, orderValue } = req.body;
        const discount = await Discount.findOne({ code, active: true });
        if (!discount) return res.status(404).json({ success: false, message: 'Discount not found or inactive' });
        const now = new Date();
        if (now < discount.startDate || now > discount.endDate) {
            return res.status(400).json({ success: false, message: 'Discount not valid at this time' });
        }
        if (discount.usedCount >= discount.usageLimit) {
            return res.status(400).json({ success: false, message: 'Discount usage limit reached' });
        }
        if (orderValue < discount.minOrderValue) {
            return res.status(400).json({ success: false, message: `Order value must be at least ${discount.minOrderValue}` });
        }
        // Kiểm tra số lần user đã dùng
        const userUsedCount = discount.usersUsed.filter(u => u.toString() === userId).length;
        if (userUsedCount >= discount.userUsageLimit) {
            return res.status(400).json({ success: false, message: 'User usage limit reached' });
        }
        // Tính toán số tiền giảm
        let discountAmount = 0;
        if (discount.discountType === 'percentage') {
            discountAmount = (orderValue * discount.discountValue) / 100;
            if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
                discountAmount = discount.maxDiscount;
            }
        } else if (discount.discountType === 'fixed') {
            discountAmount = discount.discountValue;
        }
        // Cập nhật số lần dùng
        discount.usedCount += 1;
        discount.usersUsed.push(userId);
        await discount.save();
        res.json({ success: true, discountAmount, discount });
    } catch (error) {
        res.json({ code: 400, success: false, message: error.message });
    }
};

// Thống kê discount
exports.getDiscountStats = async (req, res) => {
    try {
        // Tổng số discount
        const totalDiscounts = await Discount.countDocuments({});
        
        // Số discount đang active
        const activeDiscounts = await Discount.countDocuments({ active: true });
        
        // Số discount đã hết hạn
        const expiredDiscounts = await Discount.countDocuments({
            endDate: { $lt: new Date() }
        });
        
        // Tổng số lượt sử dụng
        const totalUsage = await Discount.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsed: { $sum: "$usedCount" }
                }
            }
        ]);
        
        // Thống kê theo loại discount
        const typeStats = await Discount.aggregate([
            {
                $group: {
                    _id: "$discountType",
                    count: { $sum: 1 },
                    totalUsed: { $sum: "$usedCount" }
                }
            }
        ]);
        
        // Thống kê theo tháng (6 tháng gần nhất)
        const monthlyStats = await Discount.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    totalUsed: { $sum: "$usedCount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);
        
        // Top 5 discount được sử dụng nhiều nhất
        const topUsedDiscounts = await Discount.find()
            .sort({ usedCount: -1 })
            .limit(5)
            .select('code description usedCount discountValue discountType');
        
        // Tổng giá trị discount đã sử dụng (ước tính)
        const totalDiscountValue = await Discount.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: { $multiply: ["$usedCount", "$maxDiscount"] } }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalDiscounts,
                activeDiscounts,
                expiredDiscounts,
                totalUsage: totalUsage[0]?.totalUsed || 0,
                totalDiscountValue: totalDiscountValue[0]?.totalValue || 0,
                typeStats: typeStats.reduce((acc, stat) => {
                    acc[stat._id] = {
                        count: stat.count,
                        totalUsed: stat.totalUsed
                    };
                    return acc;
                }, {}),
                monthlyStats,
                topUsedDiscounts
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
