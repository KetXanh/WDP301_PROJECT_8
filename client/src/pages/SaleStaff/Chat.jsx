import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Image,
  Paperclip,
  Smile,
  MessageSquare,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { getChatUsers, getChatHistory, sendMessage } from '@/services/Chatbot/ApiChatbox';
import { useSelector } from 'react-redux';

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = useSelector(state => state.customer.user);
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

  useEffect(() => {
    // Lấy danh sách user từ API
    setLoading(true);
    getChatUsers()
      .then(res => {
        if (res && res.users) {
          setContacts(res.users || []);
        } else if (Array.isArray(res)) {
          setContacts(res);
        } else {
          setContacts([]);
        }
        if (res && res.users && res.users.length > 0) {
          setSelectedContact(res.users[0]);
        } else if (Array.isArray(res) && res.length > 0) {
          setSelectedContact(res[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        toast.error('Không thể tải danh sách người dùng');
        setContacts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedContact) {
      setLoading(true);
      const fetchMessages = async () => {
        try {
          const mappedMessages = await fetchAndMapMessages(selectedContact._id);
          setMessages(mappedMessages);
        } catch (error) {
          console.error('Error loading chat history:', error);
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
          const mappedMessages = await fetchAndMapMessages(selectedContact._id);
          setMessages(mappedMessages);
        } catch (error) {
          console.error('Error polling messages:', error);
        }
      }, 3000); // Cập nhật mỗi 3 giây

      // Cleanup polling khi component unmount hoặc selectedContact thay đổi
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredContacts = contacts.filter(contact =>
    (contact.username?.toLowerCase() || contact.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (contact.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    const tempMessage = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      isCurrentUser: true,
      senderId: currentUser?._id || currentUser?.id,
      receiverId: selectedContact._id,
      isPending: true // Đánh dấu tin nhắn đang gửi
    };
    
    // Thêm tin nhắn tạm thời vào UI ngay lập tức
    setMessages(prev => [...prev, tempMessage]);
    const messageToSend = newMessage;
    setNewMessage('');
    
    try {
      await sendMessage(selectedContact._id, messageToSend);
      
      // Sau khi gửi thành công, fetch lại toàn bộ lịch sử chat
      const mapped = await fetchAndMapMessages(selectedContact._id);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    if (now.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return messageDate.toLocaleDateString('vi-VN');
    }
  };

  return (
    <div className="h-full flex">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <Card className="border-0 rounded-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Chat</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedContact?._id === contact._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.username || contact.name} />
                      <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white">
                        {(contact.username || contact.name || '').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {contact.username || contact.name}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                      <p className="text-xs text-gray-500">
                        {contact.role === "staff" ? "Nhân viên" : contact.role === "user" ? "Khách hàng" : contact.role === 2 ? "Sale Manager" : contact.role === 1 ? "Admin" : "Khác"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Không có người dùng nào để chat
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <Card className="border-0 rounded-none border-b">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={selectedContact.avatar} alt={selectedContact.username || selectedContact.name} />
                        <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white">
                          {(selectedContact.username || selectedContact.name || '').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {selectedContact.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedContact.username || selectedContact.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedContact.role === "staff" ? "Nhân viên" : "Khách hàng"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id || message._id}
                      className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                          message.isCurrentUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        } ${message.isPending ? 'opacity-70' : ''}`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                          {message.isPending && ' (đang gửi...)'}
                        </p>
                        {message.isPending && (
                          <div className="absolute -top-1 -right-1">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </ScrollArea>

            {/* Message Input */}
            <Card className="border-0 rounded-none border-t">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Image className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập tin nhắn..."
                      className="pr-20"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="icon"
                    className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn cuộc trò chuyện
              </h3>
              <p className="text-gray-500">
                Chọn một liên hệ để bắt đầu trò chuyện
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat; 