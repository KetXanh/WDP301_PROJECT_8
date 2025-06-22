const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    items: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductVariant",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Số lượng phải lớn hơn 0"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Giá phải lớn hơn hoặc bằng 0"],
        },
        isReviewed: { type: Boolean, default: false },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Tổng tiền phải lớn hơn hoặc bằng 0"],
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: [1, "Tổng số lượng phải lớn hơn 0"],
    },

    shippingAddress: {
      fullName: { type: String, required: true, trim: true },
      phone: {
        type: String,
        required: true,
        match: [/^0\d{9}$/, "Số điện thoại phải có 10 chữ số, bắt đầu bằng 0"],
      },
      street: { type: String, required: true, trim: true },
      ward: { type: String, required: true, trim: true },
      district: { type: String, required: true, trim: true },
      province: { type: String, required: true, trim: true },
    },

    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "vnpay", "momo"],
      default: "cod",
    },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports.Orders = mongoose.model("Orders", orderSchema, "orders");
