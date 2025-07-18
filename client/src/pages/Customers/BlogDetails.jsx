import React from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Heart,
  Share2,
  Clock,
  Tag,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const BlogPost = ({ blog, comments = [], onClose }) => {
    console.log(blog);
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-gray-600">
                <Heart className="w-4 h-4 mr-1" />
                Yêu thích
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-600">
                <Bookmark className="w-4 h-4 mr-1" />
                Lưu
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-600">
                <Share2 className="w-4 h-4 mr-1" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.blog.title || "Không có tiêu đề"}
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {blog.blog.description}
          </p>

          {/* Author and Meta Info */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {blog.author[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {blog.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    Chuyên gia dinh dưỡng
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={blog.blog.image}
            alt={blog.blog.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Article Content */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed space-y-6">
                <p className="text-lg font-medium text-gray-900 mb-6">
                  {blog.blog.content}
                </p>



                <p className="text-lg font-medium text-gray-900">
                  {blog.blog.content?.conclusion}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thẻ bài viết
          </h3>
          <div className="flex flex-wrap gap-2">
            {blog.blog.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-1 text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* ----- PHẦN BỔ SUNG HIỂN THỊ COMMENT ----- */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Bình luận
          </h3>

          {comments.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có bình luận nào.</p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-4 bg-white p-4 rounded-lg shadow-sm"
                >
                  <img
                    src={comment.author.avatar || "/default-avatar.png"}
                    alt={comment.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {comment.author.name}
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
