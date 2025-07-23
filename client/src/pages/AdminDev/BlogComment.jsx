import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Send, Calendar } from 'lucide-react'; // Đảm bảo import Calendar
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '../../hooks/use-toast';
import { getBlogDetail, updateComment, deleteComment as deleteCommentApi } from '../../services/Admin/AdminAPI';

export const BlogComments = ({ blogId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getBlogDetail(blogId);
      // Lấy comments đúng theo response bạn gửi
      setComments(response.data.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải bình luận",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = async (commentId, newText) => {
    try {
      await updateComment(blogId, commentId, { text: newText });
      setComments(comments.map(comment => 
        comment._id === commentId 
          ? { ...comment, text: newText, updatedAt: new Date().toISOString() }
          : comment
      ));
      setEditingComment(null);
      setEditText('');
      toast({
        title: "Thành công",
        description: "Bình luận đã được cập nhật",
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật bình luận",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      try {
        await deleteCommentApi(blogId, commentId);
        setComments(comments.filter(comment => comment._id !== commentId));
        toast({
          title: "Thành công",
          description: "Bình luận đã được xóa",
        });
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa bình luận",
          variant: "destructive",
        });
      }
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4">Đang tải bình luận...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Quản lý Bình luận</h2>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment._id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {comment.author && comment.author.name 
                            ? comment.author.name.split(' ').map(n => n[0]).join('') 
                            : 'NN'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{comment.author ? comment.author.name : 'Người dùng'}</h4>
                        <p className="text-sm text-gray-600">{comment.author ? comment.author.email : 'Không có email'}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(comment.createdAt).toLocaleString('vi-VN')}
                          {comment.updatedAt !== comment.createdAt && (
                            <span>(đã chỉnh sửa)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingComment === comment._id ? ( 
                    <div className="space-y-3">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateComment(comment._id, editText)}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Lưu
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditingComment(null)}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-800 mb-4">{comment.text}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(comment)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          size="sm"  
                          variant="outline"
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có bình luận nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
