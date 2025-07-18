import React, { useState, useEffect, use } from "react";
import { X, Save, Eye, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createBlog, updateBlog } from "../../services/Admin/AdminAPI";
import { toast } from "../../hooks/use-toast";

export const BlogForm = ({ blog, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: "",
    status: "draft",
    image: "",
  });
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        description: blog.description || "",
        content: blog.content,
        category: blog.category || "",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
        status: blog.isPublished ? "published" : "draft",
        image: blog.image || "",
      });
    }
  }, [blog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const blogData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        author: user?._id,
        image: formData.image || null,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        isPublished: formData.status === "published",
      };

      let response;
      if (blog?._id) {
        response = await updateBlog(blog._id, blogData);
      } else {
        response = await createBlog(blogData);
      }
 
      onSave(response.data);
    } catch (error) {
      console.error("Error saving blog:", error);
      setLoading(false);
      toast({
        title: "Lỗi",
        description: "Không thể lưu blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Hạt dinh dưỡng",
    "Sản phẩm sấy khô",
    "So sánh sản phẩm",
    "Công thức chế biến",
    "Tips sức khỏe",
    "Cách bảo quản",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {blog ? "Chỉnh sửa Blog Sản phẩm" : "Tạo Blog Sản phẩm Mới"}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreview(!preview)}>
              <Eye className="w-4 h-4 mr-2" />
              {preview ? "Chỉnh sửa" : "Xem trước"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!preview ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Tiêu đề sản phẩm</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="VD: Hạt Chia - Siêu thực phẩm cho sức khỏe..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Mô tả ngắn</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Mô tả ngắn về bài viết..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Danh mục sản phẩm</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục sản phẩm" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="image">URL hình ảnh</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tags">
                      Tags sản phẩm (phân cách bằng dấu phẩy)
                    </Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="Hạt chia, Omega-3, Siêu thực phẩm, Healthy..."
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag)
                        .map((tag, index) => (
                          <Badge key={index} variant="outline">
                            #{tag}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                        <SelectItem value="published">Xuất bản</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="content">Nội dung về sản phẩm</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Viết mô tả chi tiết về sản phẩm, công dụng, cách sử dụng..."
                  rows={15}
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Đang lưu..." : blog ? "Cập nhật" : "Tạo Blog"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="prose max-w-none">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {formData.title}
                      </CardTitle>
                      <p className="text-gray-600 mb-2">
                        {formData.description}
                      </p>
                      <div className="flex gap-2 mb-4">
                        {formData.category && (
                          <Badge>{formData.category}</Badge>
                        )}
                        <Badge
                          variant={
                            formData.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {formData.status === "published"
                            ? "Đã xuất bản"
                            : "Bản nháp"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt={formData.title}
                      className="w-full h-auto mb-4 rounded-lg"
                    />
                  )}
                  <div className="whitespace-pre-wrap mb-4">
                    {formData.content}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag)
                      .map((tag, index) => (
                        <Badge key={index} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
