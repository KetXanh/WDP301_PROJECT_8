const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    productBase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BaseProduct",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema, "rating");
