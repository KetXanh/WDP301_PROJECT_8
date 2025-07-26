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
import { getChatUsers, getChatHistory, sendMessage, updateMessage, deleteMessage, searchAllUsersForChat } from "@/services/Chatbot/ApiChatbox";
import { getAllChatUsers } from "@/services/SaleManager/ApiSaleManager";
import { useSelector } from "react-redux";

export default function Chat() {
  const [users, setUsers] = useState([]);
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
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const inputRef = useRef(null);
  const currentUser = useSelector(state => state.customer.user); // hoặc state.customer nếu lưu user ở đây
  const pollingIntervalRef = useRef(null);

  // Helper function để fetch và map messages
  const fetchAndMapMessages = async (userId) => {
    const res = await getChatHistory(userId);
    let msgs = [];
    if (Array.isArray(res)) {
      msgs = res;
    } else if (Array.isArray(res.data)) {
      msgs = res.data;
    } else if (res.data && Array.isArray(res.data.messages)) {
      msgs = res.data.messages;
    }
    
    const mapped = msgs.map(msg => {
      return {
        id: msg.id || msg._id,
        content: msg.content,
        timestamp: msg.timestamp ? (msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)) : new Date(),
        isCurrentUser: msg.isCurrentUser !== undefined ? msg.isCurrentUser : false,
        senderId: msg.senderId || '',
        receiverId: msg.receiverId || '',
        ...msg
      };
    });
    
    return mapped;
  };

  // Fetch users on component mount
  useEffect(() => {
    setLoading(true);
    getChatUsers()
      .then(res => {
        // Nếu trả về { users: [...] }
        if (res && res.users) {
          setUsers(res.users || []);
        } else if (Array.isArray(res)) {
          setUsers(res);
        } else {
          setUsers([]);
        }
      })
      .catch(async (err) => {
        // Nếu lỗi liên quan đến ChatMessage.find hoặc lỗi server, fallback sang getAllChatUsers
        if (err?.response?.data?.error?.includes('ChatMessage.find') || err?.response?.data?.message?.includes('Error getting chat users')) {
          try {
            const allRes = await getAllChatUsers();
            setUsers(allRes.data?.users || []);
          } catch {
            toast.error('Không thể tải danh sách người dùng');
            setUsers([]);
          }
        } else {
          toast.error('Không thể tải danh sách người dùng');
          setUsers([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (selectedUser && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      const fetchMessages = async () => {
        try {
          const mapped = await fetchAndMapMessages(selectedUser._id);
          setMessages(mapped);
        } catch {
          toast.error('Không thể tải lịch sử chat');
          setMessages([]);
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();

      // Bắt đầu polling để cập nhật tin nhắn mới
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const mapped = await fetchAndMapMessages(selectedUser._id);
          setMessages(mapped);
        } catch (error) {
          console.error('Error polling messages:', error);
        }
      }, 3000); // Cập nhật mỗi 3 giây

      // Cleanup polling khi component unmount hoặc selectedUser thay đổi
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [selectedUser, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    const tempMessage = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      isCurrentUser: true,
      senderId: currentUser?._id || currentUser?.id,
      receiverId: selectedUser._id,
      isPending: true // Đánh dấu tin nhắn đang gửi
    };
    
    // Thêm tin nhắn tạm thời vào UI ngay lập tức
    setMessages(prev => [...prev, tempMessage]);
    const messageToSend = newMessage;
    setNewMessage('');
    
    try {
      await sendMessage(selectedUser._id, messageToSend);
      
      // Sau khi gửi thành công, fetch lại toàn bộ lịch sử chat
      const mapped = await fetchAndMapMessages(selectedUser._id);
      setMessages(mapped);
      toast.success('Gửi tin nhắn thành công');
    } catch (error) {
      console.error('Error sending message:', error);
      // Nếu gửi thất bại, xóa tin nhắn tạm thời và khôi phục nội dung
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setNewMessage(messageToSend);
      toast.error('Không thể gửi tin nhắn');
    }
  };

  const handleUpdateMessage = async (messageId, newContent) => {
    try {
      await updateMessage(messageId, newContent);
      
      // Fetch lại toàn bộ lịch sử chat sau khi cập nhật
      const mapped = await fetchAndMapMessages(selectedUser._id);
      setMessages(mapped);
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
      await deleteMessage(messageId);
      
      // Fetch lại toàn bộ lịch sử chat sau khi xóa
      const mapped = await fetchAndMapMessages(selectedUser._id);
      setMessages(mapped);
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
    const matchesSearch = (user.username?.toLowerCase() || user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Search all users for chat
  const handleGlobalUserSearch = async () => {
    setLoading(true);
    try {
      const results = await searchAllUsersForChat(searchQuery);
      setGlobalSearchResults(results);
      setShowGlobalSearch(true);
    } catch {
      toast.error('Không thể tìm kiếm người dùng');
    }
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
      {/* User List Sidebar */}
      <div className="w-72 border-r flex flex-col bg-muted/50">
        <div className="p-4 border-b bg-gradient-to-r from-green-600/10 to-amber-600/10">
          <h3 className="font-semibold mb-4 text-lg">Tất cả người dùng</h3>

          {/* Search and Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowGlobalSearch(false); }}
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
            ) : showGlobalSearch ? (
              globalSearchResults.length > 0 ? (
                globalSearchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => { setSelectedUser(user); setShowGlobalSearch(false); setGlobalSearchResults([]); }}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200",
                      selectedUser?._id === user._id
                        ? "bg-primary/20 border-l-4 border-primary shadow"
                        : "hover:bg-muted"
                    )}
                  >
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white text-xl font-bold">
                        {user.username?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || <User className="h-7 w-7" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-base">{user.username || user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.role === "staff" ? "Nhân viên" : user.role === "user" ? "Khách hàng" : user.role === 2 ? "Sale Manager" : user.role === 1 ? "Admin" : "Khác"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">Không tìm thấy người dùng phù hợp</div>
              )
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200",
                    selectedUser?._id === user._id
                      ? "bg-primary/20 border-l-4 border-primary shadow"
                      : "hover:bg-muted"
                  )}
                >
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white text-xl font-bold">
                      {user.username?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || <User className="h-7 w-7" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-base">{user.username || user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.role === "staff" ? "Nhân viên" : user.role === "user" ? "Khách hàng" : user.role === 2 ? "Sale Manager" : user.role === 1 ? "Admin" : "Khác"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="text-center text-muted-foreground py-4">Không có người dùng nào trong lịch sử chat.</div>
                {searchQuery && (
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={handleGlobalUserSearch}>
                      Tìm tất cả người dùng phù hợp để nhắn tin
                    </Button>
                  </div>
                )}
              </>
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
                <h3 className="font-semibold">{selectedUser.username || selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.role === "staff" ? "Nhân viên" : "Khách hàng"}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-white to-muted/30">
              <div className="space-y-4">
                {messages.map((message) => {
                  return (
                  <div
                    key={message.id || message._id}
                    className={cn(
                      "flex items-end gap-2",
                      message.isCurrentUser ? "justify-end" : "justify-start"
                    )}
                  >
                                         <div
                       className={cn(
                         "max-w-[70%] rounded-lg px-4 py-2 shadow-sm relative",
                         message.isCurrentUser
                           ? "bg-blue-500 text-white"
                           : "bg-white",
                         message.isPending && "opacity-70"
                       )}
                     >
                       <p>{message.content}</p>
                       <span className={cn(
                         "text-xs opacity-70",
                         message.isCurrentUser ? "text-white/70" : "text-muted-foreground"
                       )}>
                         {format(new Date(message.timestamp), 'HH:mm')}
                         {message.updatedAt && ' (đã chỉnh sửa)'}
                         {message.isPending && ' (đang gửi...)'}
                       </span>
                       {message.isPending && (
                         <div className="absolute -top-1 -right-1">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                         </div>
                       )}
                     </div>
                    {getMessageActions(message)}
                  </div>
                );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex gap-2">
              <Textarea
                ref={inputRef}
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