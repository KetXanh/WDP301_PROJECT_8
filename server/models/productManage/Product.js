const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  unit: { type: String },
  weight: { type: Number },
  inventory: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
  status: { type: String, enum: ['available', 'out_of_stock', 'hidden'], default: 'available' },
  images: [{ type: String }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);