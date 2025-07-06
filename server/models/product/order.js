const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    fullName: { type: String, trim: true },
    street: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);
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
        quantity: Number,
        price: Number,
      },
    ],
    payment: { type: String, enum: ["CASH", "BANK"], default: "CASH" },
    COD: String,
    totalAmount: Number,
    totalQuantity: Number,
    shippingAddress: addressSchema,
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);


module.exports.Orders = mongoose.model("Orders", orderSchema, "orders");
