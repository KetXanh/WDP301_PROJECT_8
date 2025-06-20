const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema(
  {
    baseProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BaseProduct",
      required: true,
    },
    price: Number,
    stock: Number,

    expiryDate: {
      type: Date,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProductVariant', productVariantSchema, 'productvariant');
