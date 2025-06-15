const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    items: [
        {
            _id: false,
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: Number,
    totalQuantity: Number,
    shippingAddress: String,
    status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
}, { timestamps: true });


module.exports.Orders = mongoose.model("Orders", orderSchema, "orders");

