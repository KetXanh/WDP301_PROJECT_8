const mongoose = require("mongoose");
const slugify = require("slugify");

const baseProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true, sparse: true },
    description: String,
    image: {
      url: String,
      public_id: String,
    },
    origin: String,
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategories",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate slug
baseProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      locale: "vi",
    });
  }
  next();
});

module.exports = mongoose.model(
  "BaseProduct",
  baseProductSchema,
  "baseproduct"
);
