
const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // VD: SUMMER2025
    description: { type: String },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true }, // 10 (%), hoặc 50000 (VNĐ)
    minOrderValue: { type: Number, default: 0 }, // Đơn tối thiểu để áp dụng
    maxDiscount: { type: Number }, // Nếu là % thì có thể giới hạn giảm tối đa
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    userUsageLimit: { type: Number, default: 1 }, // mỗi user dùng được bao nhiêu lần
    usersUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema, "discounts");
