const mongoose = require("mongoose");
const { Schema } = mongoose;

// Comment Schema
const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // Chuẩn hóa tên model User
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Blog Schema
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // Tìm kiếm nhanh hơn
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    image: {
      type: String, // URL ảnh đại diện
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],
    comments: [commentSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Tạo index cho tags (nếu cần tìm kiếm theo tag)
blogSchema.index({ tags: 1 });

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
