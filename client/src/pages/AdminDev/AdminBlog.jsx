import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MessageSquare,
  User,
  Calendar,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogForm } from "../../pages/AdminDev/BlogForm";
import { BlogComments } from "../../pages/AdminDev/BlogComment";
import { toast } from "../../hooks/use-toast";
import {
  getAllBlogs,
  deleteBlog as deleteBlogApi,
} from "../../services/Admin/AdminAPI";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedBlogForComments, setSelectedBlogForComments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogs();
      console.log("✅ Response from getAllBlogs:", response);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      console.log("✅ Processed blog list:", data);
      setBlogs(data);
    } catch (error) {
      console.error("❌ Error fetching blogs:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateBlog = () => {
    setSelectedBlog(null);
    setIsFormOpen(true);
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setIsFormOpen(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa blog này?")) {
      try {
        await deleteBlogApi(blogId);
        setBlogs(blogs.filter((blog) => (blog._id || blog.id) !== blogId));
        toast({
          title: "Thành công",
          description: "Blog đã được xóa thành công",
        });
      } catch (error) {
        console.error("❌ Error deleting blog:", error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa blog",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewComments = (blogId) => {
    setSelectedBlogForComments(blogId);
    setIsCommentsOpen(true);
  }; 

  const handleBlogSaved = (savedBlog) => {
    if (selectedBlog) {
      setBlogs(
        blogs.map((b) =>
          (b._id || b.id) === (savedBlog._id || savedBlog.id) ? savedBlog : b
        )
      );
    } else {
      setBlogs([savedBlog, ...blogs]);
    }
    setIsFormOpen(false);
    toast({
      title: "Thành công",
      description: selectedBlog
        ? "Blog đã được cập nhật"
        : "Blog đã được tạo mới",
    });
    setSelectedBlog(null);
    setSelectedBlogForComments(null);
    setIsCommentsOpen(false);
    fetchBlogs(); // Refresh the blog list
  };

  const categories = [
    "all",
    "Hạt dinh dưỡng",
    "So sánh sản phẩm",
    "Công thức",
    "Sản phẩm sấy khô",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý Blog Sản phẩm
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý nội dung về hạt dinh dưỡng và sản phẩm sấy khô
              </p>
            </div>
            <Button
              onClick={handleCreateBlog}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo Blog Mới
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  &#x2715; {/* dấu x */}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Blog List */}
        <div className="grid gap-6">
          {filteredBlogs.map((blog) => (
            <Card
              key={blog._id || blog.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{blog.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {blog.author?.name || "Không rõ"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {blog.views ?? 0} lượt xem
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {blog.commentsCount ?? 0} bình luận
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        blog.status === "published" ? "default" : "secondary"
                      }
                    >
                      {blog.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                    </Badge>
                    <Badge variant="outline">{blog.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {blog.content?.substring(0, 150)}...
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(blog.tags) &&
                    blog.tags.map((tag, index) => (
                      <Badge
                        key={`${tag}-${index}`}
                        variant="outline"
                        className="text-xs"
                      >
                        #{tag}
                      </Badge>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Cập nhật:{" "}
                    {new Date(blog.updatedAt).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewComments(blog._id || blog.id)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" /> Bình luận
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBlog(blog)}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBlog(blog._id || blog.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Xóa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-lg">
            Không tìm thấy blog nào
          </div>
        )}
      </div>

      {/* Blog Form Modal */}
      {isFormOpen && (
        <BlogForm
          blog={selectedBlog}
          onClose={() => setIsFormOpen(false)}
          onSave={handleBlogSaved}
        />
      )}

      {/* Comments Modal */}
      {isCommentsOpen && selectedBlogForComments && (
        <BlogComments
          blogId={selectedBlogForComments}
          onClose={() => setIsCommentsOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminBlog;
