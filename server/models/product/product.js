const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategories",
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" }
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
}, {
    timestamps: true    
});

module.exports.Product = mongoose.model("Products", ProductSchema, "products");