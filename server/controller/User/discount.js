const Discount = require('../../models/product/discount');
const Users = require('../../models/user');

// Lấy mã giảm giá gán cho user hiện tại
exports.getUserDiscounts = async (req, res) => {
    try {
        let currentUserRaw = req.user
        const currentUser = await Users.findOne({ email: currentUserRaw.email });
        const currentUserId = currentUser._id.toString();
        if (!currentUserId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        // Lấy các discount mà user đã từng dùng hoặc được gán (usersUsed chứa userId)
        const discounts = await Discount.find({ usersUsed: currentUserId });
        res.json({ success: true, data: discounts });
    } catch (error) {
        res.json({ code: 500, success: false, message: error.message });
    }
};

exports.applyDiscount = async (req, res) => {
    try {
        const { discountCode } = req.body;
        const discount = await Discount.findOne({ code: discountCode });
        if (!discount) {
            return res.json({ code: 404, success: false, message: "Discount not found" });
        }
        if (!discount.active) {
            return res.json({ code: 400, success: false, message: "Discount is not active" });
        }
        if (discount.endDate < new Date()) {
            return res.json({ code: 400, success: false, message: "Discount has expired" });
        }
        if (discount.usageLimit <= discount.usedCount) {
            return res.json({ code: 400, success: false, message: "Discount has reached its usage limit" });
        }
        if (discount.userUsageLimit <= discount.usersUsed.length) {
            return res.json({ code: 400, success: false, message: "Discount has reached its user usage limit" });
        }
        if (discount.minOrderValue > req.body.totalAmount) {
            return res.json({ code: 400, success: false, message: "Total amount is less than the minimum order value" });
        }
        if (discount.maxDiscount && discount.maxDiscount < req.body.totalAmount) {
            return res.json({ code: 400, success: false, message: "Total amount is greater than the maximum discount" });
        }
        const discountAmount = discount.discountType === 'percentage' ? req.body.totalAmount * discount.discountValue / 100 : discount.discountValue;
        res.json({ success: true, data: discountAmount });
    } catch (error) {
        res.json({ code: 500, success: false, message: error.message });
    }
}

exports.getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find();
        res.json({ success: true, data: discounts });
    } catch (error) {
        res.json({ code: 500, success: false, message: error.message });
    }
}

exports.getDiscountById = async (req, res) => {
    try {
        const { id } = req.params;
        const discount = await Discount.findById(id);
        res.json({ success: true, data: discount });
    } catch (error) {
        res.json({ code: 500, success: false, message: error.message });
    }
}
