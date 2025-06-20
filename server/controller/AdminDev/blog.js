const Blog = require("../../models/blog");
// Tạo blog mới
exports.createBlog = async (req, res) => {
  try {
    const { title, description, content, tags, image } = req.body;
    const author = req.user._id; // Lấy từ middleware xác thực
    const blog = await Blog.create({ title, description, content, tags, image, author });
    res.status(201).json({ code: 201, message: "Tạo blog thành công", data: blog });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
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
    res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

// Lấy chi tiết blog (kèm comment)
exports.getBlogDetail = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name avatar");
    if (!blog) return res.status(404).json({ code: 404, message: "Không tìm thấy blog" });
    const comments = await Comment.find({ blog: blog._id }).populate("author", "name avatar");
    res.json({ code: 200, data: { blog, comments } });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
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
    if (!blog) return res.status(404).json({ code: 404, message: "Không tìm thấy blog" });
    res.json({ code: 200, message: "Cập nhật blog thành công", data: blog });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

// Xóa blog (và comment liên quan)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ code: 404, message: "Không tìm thấy blog" });
    await Comment.deleteMany({ blog: blog._id });
    res.json({ code: 200, message: "Xóa blog thành công" });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

// Thêm comment cho blog (embedded)
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const author = req.user._id;
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ code: 404, message: "Không tìm thấy blog" });
    const comment = { author, text };
    blog.comments.push(comment);
    await blog.save();
    // Lấy comment vừa thêm (có _id)
    const newComment = blog.comments[blog.comments.length - 1];
    await newComment.populate('author', 'name avatar');
    res.status(201).json({ code: 201, message: "Bình luận thành công", data: newComment });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

// Xóa comment khỏi blog (embedded)
exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ code: 404, message: "Không tìm thấy blog" });
    const commentIndex = blog.comments.findIndex(c => c._id.toString() === commentId);
    if (commentIndex === -1) return res.status(404).json({ code: 404, message: "Không tìm thấy comment" });
    blog.comments.splice(commentIndex, 1);
    await blog.save();
    res.json({ code: 200, message: "Xóa comment thành công" });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

