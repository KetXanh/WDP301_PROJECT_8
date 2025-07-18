import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  User,
  Eye,
  MessageSquare,
  Tag,
  Filter,
  Clock,
  Heart,
  Share2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "../../pages/Customers/BlogDetails";
import { getAllBlogs, getBlogDetail } from "../../services/Admin/AdminAPI";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsData = await getAllBlogs();

      const formattedBlogs = blogsData.map((blog) => ({
        ...blog,
        author: blog.author?.name || "Tác giả ẩn danh",
        date: new Date(blog.createdAt).toLocaleDateString("vi-VN"),
        readTime: Math.ceil(blog.content.length / 500) + " phút đọc",
        excerpt: blog.description || blog.content.slice(0, 100) + "...",
      }));

      setBlogs(formattedBlogs);
    };

    fetchBlogs();
  }, []);
  
  const handleReadMore = async (blog) => {
    try {
      const response = await getBlogDetail(blog._id || blog.id);
      const fullBlog = response.data.data;

      // Format content nếu cần
      const enrichedBlog = {
        ...fullBlog,
        author: fullBlog.author?.name || "Tác giả ẩn danh",
        date: new Date(fullBlog.createdAt).toLocaleDateString("vi-VN"),
        readTime:
          Math.ceil(fullBlog.content?.introduction?.length / 500 || 1) +
          " phút đọc",
        excerpt:
          fullBlog.description ||
          fullBlog.content?.introduction?.slice(0, 100) + "...",
        comments: fullBlog.comments?.length || 0,
      };

      setSelectedBlog(enrichedBlog);
    } catch (err) {
      console.error("Lỗi lấy chi tiết blog:", err);
    }
  };

  const handleCloseBlog = () => {
    setSelectedBlog(null);
  };

  if (selectedBlog) {
    return <BlogPost blog={selectedBlog} onClose={handleCloseBlog} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Blog Dinh Dưỡng
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Khám phá thế giới hạt dinh dưỡng và sản phẩm tự nhiên, cùng những
              công thức độc đáo cho sức khỏe tối ưu
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm bài viết, công thức, sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-12 h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Featured Posts Grid */}
        {blogs.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Bài viết nổi bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card
                  key={blog._id || blog.id}
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white rounded-2xl overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1">
                        {blog.category || "Không có danh mục"}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 h-auto"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title || "Không có tiêu đề"}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed">
                      {blog.excerpt || "Không có mô tả"}
                    </p>
                  </CardHeader>

                  <CardContent className="px-6 pb-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags?.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs px-2 py-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{blog.author || "Không rõ tác giả"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{blog.date || "Không có ngày"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{blog.readTime || "Không rõ"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Button
                      onClick={() => handleReadMore(blog)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
                    >
                      Đọc tiếp
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Không có bài viết nào
            </h3>
            <p className="text-gray-600 mb-6">
              Hiện chưa có bài viết nào được đăng tải
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
