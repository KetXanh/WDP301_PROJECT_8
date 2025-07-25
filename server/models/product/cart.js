const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    items: [
        {
            _id: false,
            product: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant" },
            quantity: { type: Number, default: 1, min: 1 },
            price: Number
        }
    ],
    totalPrice: Number,
    totalQuantity: Number,
    expiresAt: { type: Date }
}, { timestamps: true });

module.exports.Carts = mongoose.model("Carts", cartSchema, "carts");
