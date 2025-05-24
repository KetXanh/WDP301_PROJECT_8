const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isActive: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("SubCategory", subCategorySchema);