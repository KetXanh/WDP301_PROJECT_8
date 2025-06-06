const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
    baseProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BaseProduct',
        required: true
    },
    price: Number,
    stock: Number
}, { timestamps: true });

module.exports = mongoose.model('ProductVariant', productVariantSchema, 'productvariant');
