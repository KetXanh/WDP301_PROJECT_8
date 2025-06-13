import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Send, MoreVertical, User, X, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
// import { getChatUsers, getChatHistory, sendMessage, updateMessage, deleteMessage } from "@/services/Chatbot/ApiChatbox";

// Mock data for UI testing
const DEMO_USERS = [
  { _id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", avatar: null, role: "staff", status: "online" },
  { _id: 2, name: "Trần Thị B", email: "tranthib@example.com", avatar: null, role: "staff", status: "online" },
  { _id: 3, name: "Lê Văn C", email: "levanc@example.com", avatar: null, role: "staff", status: "offline" },
  { _id: 4, name: "Khách hàng 1", email: "khachhang1@example.com", avatar: null, role: "user", status: "online" },
  { _id: 5, name: "Khách hàng 2", email: "khachhang2@example.com", avatar: null, role: "user", status: "offline" },
];

const DEMO_MESSAGES = {
  1: [
    { _id: 1, content: "Chào anh/chị", timestamp: new Date(), isCurrentUser: false },
    { _id: 2, content: "Chào bạn, tôi có thể giúp gì cho bạn?", timestamp: new Date(), isCurrentUser: true },
  ],
  2: [
    { _id: 1, content: "Báo cáo doanh số tháng này như thế nào?", timestamp: new Date(), isCurrentUser: false },
  ],
};

export default function Chat() {
  const [users, setUsers] = useState(DEMO_USERS);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch users on component mount
  useEffect(() => {
    // Simulate API call delay
    setLoading(true);
    setTimeout(() => {
      setUsers(DEMO_USERS);
      setLoading(false);
    }, 1000);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      // Simulate loading chat history
      setLoading(true);
      setTimeout(() => {
        setMessages(DEMO_MESSAGES[selectedUser._id] || []);
        setLoading(false);
      }, 500);
    }
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      // Simulate API call
      const newMsg = {
        _id: Date.now(),
        content: newMessage,
        timestamp: new Date(),
        isCurrentUser: true,
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      toast.success('Gửi tin nhắn thành công');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn');
    }
  };

  const handleUpdateMessage = async (messageId, newContent) => {
    try {
      // Simulate API call
      setMessages(messages.map(msg =>
        msg._id === messageId ? { ...msg, content: newContent, updatedAt: new Date() } : msg
      ));
      toast.success('Cập nhật tin nhắn thành công');
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Không thể cập nhật tin nhắn');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      // Simulate API call
      setMessages(messages.filter(msg => msg._id !== messageId));
      toast.success('Xóa tin nhắn thành công');
      setMessageToDelete(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Không thể xóa tin nhắn');
    }
  };

  const getMessageActions = (message) => {
    if (!message.isCurrentUser) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {
            setEditingMessage(message);
            setEditContent(message.content);
          }}>
            <Edit2 className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMessageToDelete(message)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
      {/* User List Sidebar */}
      <div className="w-64 border-r flex flex-col bg-muted/50">
        <div className="p-4 border-b bg-gradient-to-r from-green-600/10 to-amber-600/10">
          <h3 className="font-semibold mb-4">Danh sách chat</h3>

          {/* Search and Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="staff">Nhân viên</SelectItem>
                <SelectItem value="user">Khách hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                    selectedUser?._id === user._id
                      ? "bg-primary/10 border-l-2 border-primary"
                      : "hover:bg-muted"
                  )}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.role === "staff" ? "Nhân viên" : "Khách hàng"}
                    </p>
                  </div>
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  )} />
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Không tìm thấy người dùng
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gradient-to-r from-green-600/10 to-amber-600/10 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedUser.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.role === "staff" ? "Nhân viên" : "Khách hàng"}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-white to-muted/30">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id || message._id}
                    className={cn(
                      "flex items-end gap-2",
                      message.isCurrentUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
                        message.isCurrentUser
                          ? "bg-blue-500 text-white"
                          : "bg-white"
                      )}
                    >
                      <p>{message.content}</p>
                      <span className={cn(
                        "text-xs opacity-70",
                        message.isCurrentUser ? "text-white/70" : "text-muted-foreground"
                      )}>
                        {format(new Date(message.timestamp), 'HH:mm')}
                        {message.updatedAt && ' (đã chỉnh sửa)'}
                      </span>
                    </div>
                    {getMessageActions(message)}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="min-h-[40px] max-h-[120px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!newMessage.trim()}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium mb-2">Chọn người để chat</h3>
            <p className="text-sm text-center">
              Chọn một người từ danh sách để bắt đầu cuộc trò chuyện
            </p>
          </div>
        )}
      </div>

      {/* Edit Message Dialog */}
      <Dialog open={!!editingMessage} onOpenChange={() => setEditingMessage(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <h2 className="text-lg font-semibold mb-4">Chỉnh sửa tin nhắn</h2>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditingMessage(null)}>
              Hủy
            </Button>
            <Button
              onClick={() => handleUpdateMessage(editingMessage?.id || editingMessage?._id, editContent)}
              className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!messageToDelete} onOpenChange={() => setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tin nhắn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tin nhắn này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteMessage(messageToDelete?.id || messageToDelete?._id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 