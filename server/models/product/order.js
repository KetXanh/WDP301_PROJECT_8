const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },

    items: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductVariant",
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },

        isReviewed: { type: Boolean, default: false },
      },
    ],

    totalAmount: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },

    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      ward: String,
      district: String,
      province: String,
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
