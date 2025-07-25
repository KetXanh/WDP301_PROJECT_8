const Blog = require("../../models/blog");
const Users = require("../../models/user");
const mongoose = require("mongoose");
// Tạo blog mới
exports.createBlog = async (req, res) => {
  try {
    const { title, description, content, tags, image } = req.body;
    const author = req.user.id;
    const blog = await Blog.create({
      title,
      description,
      content,
      tags,
      image,
      author,
    });
    res
      .status(201)
      .json({ code: 201, message: "Tạo blog thành công", data: blog });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

// Lấy danh sách blog (có phân trang)
exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name avatar");
    res.json({ code: 200, data: blogs });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

// Lấy chi tiết blog (kèm comment)
exports.getBlogDetail = async (req, res) => {
  try {
    const blogId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ code: 400, message: "ID không hợp lệ" });
    }
    
    // Lấy blog và populate author ở blog + author trong comments
    const blog = await Blog.findById(blogId)
      .populate("author", "name avatar")
      .populate("comments.author", "name avatar");  // populate tác giả comment

    if (!blog) {
      return res.status(404).json({ code: 404, message: "Không tìm thấy blog" });
    }

    // comments đã nằm trong blog.comments rồi
    res.json({ code: 200, data: { blog, comments: blog.comments } });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết blog:", err);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: err.message,
    });
  }
};


// Cập nhật blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, description, content, tags, image, isPublished } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, content, tags, image, isPublished },
      { new: true }
    );
    if (!blog)
      return res
        .status(404)
        .json({ code: 404, message: "Không tìm thấy blog" });
    res.json({ code: 200, message: "Cập nhật blog thành công", data: blog });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

// Xóa blog (và comment liên quan)
exports.deleteBlog = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const blogId = req.params.id;
    const userId = req.user.id; // Lấy từ middleware authenticate
    const userRole = req.user.role; // Lấy từ middleware authenticate

    console.log(`Attempting to delete blog ${blogId} by user ${userId}`);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      await session.abortTransaction();
      return res.status(400).json({
        code: 400,
        message: "ID blog không hợp lệ",
      });
    }

    // Tìm blog và kiểm tra quyền
    const blog = await Blog.findById(blogId).session(session);
    if (!blog) {
      await session.abortTransaction();
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy blog",
      });
    }

    // Kiểm tra quyền: Admin hoặc chính tác giả
    if (userRole !== 1 && blog.author.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xóa blog này",
      });
    }

    // Thực hiện xóa trong transaction
    await Blog.deleteOne({ _id: blogId }).session(session);
   

    await session.commitTransaction();
    console.log(`Successfully deleted blog ${blogId}`);

    return res.json({
      code: 200,
      message: "Xóa blog thành công",
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("DELETE BLOG ERROR:", {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi xóa blog",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  } finally {
    session.endSession();
  }
};

// Thêm comment cho blog (embedded)
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const author = req.user._id;
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ code: 404, message: "Không tìm thấy blog" });
    const comment = { author, text };
    blog.comments.push(comment);
    await blog.save();
    // Lấy comment vừa thêm (có _id)
    const newComment = blog.comments[blog.comments.length - 1];
    await newComment.populate("author", "name avatar");
    res
      .status(201)
      .json({ code: 201, message: "Bình luận thành công", data: newComment });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, message: "Lỗi server", error: err.message });
  }
};
// module.exports.updateComment = async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     const { text } = req.body;

//     // Kiểm tra dữ liệu
//     if (!text || !text.trim()) {
//       return res.status(400).json({ code: 400, message: "Nội dung bình luận không được để trống" });
//     }

//     // Tìm blog
//     const blog = await Blog.findById(blogId);
//     console.log(blog);

//     if (!blog) {
//       return res.status(404).json({ code: 404, message: "Không tìm thấy blog" });
//     }

//     const user = await Users.find({email: req.user.email});

//     const comment = blog.comments.find(c => c.author === user._id);

//     // Cập nhật nội dung bình luận
//     comment.text = text;
//     comment.updatedAt = new Date(); // để cập nhật thời gian sửa đổi

//     // Lưu lại blog
//     await blog.save();

//     return res.status(200).json({
//       code: 200,
//       message: "Cập nhật bình luận thành công",
//       data: comment,
//     });
//   } catch (err) {
//     console.error("Lỗi khi cập nhật bình luận:", err);
//     return res.status(500).json({
//       code: 500,
//       message: "Lỗi server",
//       error: err.message,
//     });
//   }
// };

// Xóa comment khỏi blog
exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const blog = await Blog.findById(blogId);
    const author = req.user;
    if (!blog)
      return res
        .status(404)
        .json({ code: 404, message: "Không tìm thấy blog" });
    if (author.toString() !== blog.author.toString())
      return res
        .status(403)
        .json({ code: 403, message: "Bạn không có quyền xóa comment này" });
    const commentIndex = blog.comments.findIndex(
      (c) => c._id.toString() === commentId
    );
    if (commentIndex === -1)
      return res
        .status(404)
        .json({ code: 404, message: "Không tìm thấy comment" });
    blog.comments.splice(commentIndex, 1);
    await blog.save();
    res.json({ code: 200, message: "Xóa comment thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, message: "Lỗi server", error: err.message });
  }
};
