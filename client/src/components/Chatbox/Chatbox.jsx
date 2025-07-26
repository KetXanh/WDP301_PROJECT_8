import { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory, updateMessage, deleteMessage, getStaffUsers } from '../../services/Chatbot/ApiChatbox';
import { format } from 'date-fns';
import { Send, MoreVertical, User, X, Edit2, Trash2, LogIn, Sparkles } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogContent } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import { cn } from "../../lib/utils";
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Chatbox = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Message suggestions for staff chat
    const staffSuggestions = [
        "Xin chào! Tôi cần hỗ trợ",
        "Tôi có câu hỏi về đơn hàng",
        "Cần tư vấn về sản phẩm",
        "Tôi muốn đặt hàng",
        "Có vấn đề với thanh toán",
        "Kiểm tra tình trạng đơn hàng",
        "Tôi muốn hủy đơn hàng",
        "Cảm ơn bạn đã hỗ trợ"
    ];
    
    useEffect(() => {
        if (isOpen) {
            fetchStaffUsers();
        }
    }, [isOpen]);

    const fetchStaffUsers = async () => {
        try {
            setLoading(true);
            setIsUnauthorized(false);
            const data = await getStaffUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching staff users:', error);
            
            // Check if it's a 401 Unauthorized error
            if (error.response?.status === 401) {
                setIsUnauthorized(true);
                toast.error('Vui lòng đăng nhập để sử dụng tính năng chat');
            } else {
                toast.error('Failed to load staff users');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLoginClick = () => {
        onClose();
        navigate('/login');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (selectedUser && !isUnauthorized) {
            loadChatHistory();
        }
    }, [selectedUser, isUnauthorized]);

    const loadChatHistory = async () => {
        try {
            const data = await getChatHistory(selectedUser._id);
            const sortedMessages = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setMessages(sortedMessages);
        } catch (error) {
            console.error('Error loading chat history:', error);
            if (error.response?.status === 401) {
                setIsUnauthorized(true);
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
            } else {
                toast.error('Failed to load chat history');
            }
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || isUnauthorized) return;

        try {
            await sendMessage(selectedUser._id, newMessage);
            setNewMessage('');
            loadChatHistory();
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response?.status === 401) {
                setIsUnauthorized(true);
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
            } else {
                toast.error('Failed to send message');
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setNewMessage(suggestion);
    };

    const handleUpdateMessage = async (messageId, newContent) => {
        try {
            await updateMessage(messageId, newContent);
            toast.success('Message updated successfully');
            setEditingMessage(null);
            setEditContent('');
            loadChatHistory();
        } catch (error) {
            console.error('Error updating message:', error);
            if (error.response?.status === 401) {
                setIsUnauthorized(true);
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
            } else {
                toast.error('Failed to update message');
            }
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteMessage(messageId);
            toast.success('Message deleted successfully');
            setMessageToDelete(null);
            loadChatHistory();
        } catch (error) {
            console.error('Error deleting message:', error);
            if (error.response?.status === 401) {
                setIsUnauthorized(true);
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
            } else {
                toast.error('Failed to delete message');
            }
        }
    };

    const onUpdate = (message) => {
        setEditingMessage(message);
        setEditContent(message.content);
    };

    const onDelete = (message) => {
        setMessageToDelete(message);
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
                    <DropdownMenuItem onClick={() => onUpdate(message)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit message
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(message)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete message
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 1: return 'Admin';
            case 2: return 'Sale Manager';
            case 4: return 'Sale Staff';
            default: return 'User';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 1: return 'bg-red-500';
            case 2: return 'bg-blue-500';
            case 4: return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm h-[450px] p-0 sm:max-w-[400px] fixed bottom-10 right-20 translate-y-0 translate-x-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=open]:slide-in-from-bottom-1/2 !translate-x-0 !translate-y-0 !left-auto !top-auto">
                <div className="flex h-full">
                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute right-2 top-2 z-10 hover:bg-destructive/10"
                    >
                        <X className="h-4 w-4" />
                    </Button>

                    {/* User List Sidebar - Hidden on mobile */}
                    <div className="hidden md:block w-32 border-r flex flex-col bg-muted/50">
                        <div className="p-2 border-b bg-gradient-to-r from-green-600/10 to-amber-600/10">
                            <h3 className="font-semibold text-sm">Staff</h3>
                        </div>

                        <ScrollArea className="flex-1">
                            {loading ? (
                                <div className="flex items-center justify-center h-24">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : isUnauthorized ? (
                                <div className="flex flex-col items-center justify-center h-24 p-4 text-center">
                                    <div className="text-2xl mb-2">🔒</div>
                                    <p className="text-xs text-muted-foreground mb-2">Cần đăng nhập</p>
                                    <Button 
                                        size="sm" 
                                        onClick={handleLoginClick}
                                        className="text-xs bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                                    >
                                        <LogIn className="h-3 w-3 mr-1" />
                                        Đăng nhập
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-1">
                                    {users.map((user) => (
                                        <div
                                            key={user._id}
                                            onClick={() => setSelectedUser(user)}
                                            className={cn(
                                                "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200",
                                                selectedUser?._id === user._id
                                                    ? "bg-primary/10 border-l-2 border-primary"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white text-xs">
                                                    <User className="h-3 w-3" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-xs truncate">{user.username || user.name}</p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", getRoleColor(user.role))} />
                                                    <span className="text-[10px] text-muted-foreground">{getRoleLabel(user.role)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {isUnauthorized ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4">
                                <div className="text-4xl mb-4">🔒</div>
                                <h3 className="text-sm font-medium mb-2 text-center">Cần đăng nhập</h3>
                                <p className="text-xs text-center mb-4">
                                    Vui lòng đăng nhập để sử dụng tính năng chat với nhân viên
                                </p>
                                <Button 
                                    onClick={handleLoginClick}
                                    className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                                >
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Đăng nhập ngay
                                </Button>
                            </div>
                        ) : selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-2 border-b bg-gradient-to-r from-green-600/10 to-amber-600/10 flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={selectedUser.avatar} />
                                        <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white text-xs">
                                            <User className="h-3 w-3" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm">{selectedUser.username || selectedUser.name}</h3>
                                        <div className="flex items-center gap-1">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", getRoleColor(selectedUser.role))} />
                                            <p className="text-xs text-muted-foreground">{getRoleLabel(selectedUser.role)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <ScrollArea className="flex-1 p-2 bg-gradient-to-b from-white to-muted/30">
                                    <div className="space-y-2">
                                        {messages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                                                <div className="text-2xl mb-2">💬</div>
                                                <h3 className="text-sm font-medium mb-1 text-center">Bắt đầu cuộc trò chuyện</h3>
                                                <p className="text-xs text-center mb-4">
                                                    Chọn một gợi ý để bắt đầu
                                                </p>
                                                
                                                {/* Message Suggestions */}
                                                <div className="w-full space-y-2">
                                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Sparkles className="h-3 w-3" />
                                                    <span>Gợi ý tin nhắn:</span>
                                                  </div>
                                                  <div className="grid grid-cols-1 gap-1">
                                                    {staffSuggestions.slice(0, 4).map((suggestion, index) => (
                                                      <button
                                                        key={index}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="text-left p-2 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-all duration-200 text-gray-700"
                                                      >
                                                        {suggestion}
                                                      </button>
                                                    ))}
                                                  </div>
                                                </div>
                                            </div>
                                        ) : (
                                            messages.map((message) => (
                                                <div
                                                    key={message.id || message._id}
                                                    className={cn(
                                                        "flex items-end gap-1",
                                                        message.isCurrentUser ? "justify-end" : "justify-start"
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-[85%] rounded-lg px-2 py-1 text-xs shadow-sm",
                                                            message.isCurrentUser
                                                                ? "bg-gradient-to-r from-green-600 to-amber-600 text-white"
                                                                : "bg-white"
                                                        )}
                                                    >
                                                        <p>{message.content}</p>
                                                        <span className={cn(
                                                            "text-[10px] opacity-70",
                                                            message.isCurrentUser ? "text-white/70" : "text-muted-foreground"
                                                        )}>
                                                            {format(new Date(message.timestamp), 'HH:mm')}
                                                            {message.updatedAt && ' (edited)'}
                                                        </span>
                                                    </div>
                                                    {getMessageActions(message)}
                                                </div>
                                            ))
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-2 border-t bg-white flex gap-1">
                                    <Textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="min-h-[32px] max-h-[60px] resize-none rounded-full px-3 py-1 text-xs"
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
                                        className="h-8 w-8 rounded-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                                    >
                                        <Send className="h-3 w-3" />
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-2">
                                <div className="text-2xl mb-2">💬</div>
                                <h3 className="text-sm font-medium mb-1 text-center">Select a staff member</h3>
                                <p className="text-xs text-center">
                                    Choose someone to chat with
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Message Dialog */}
                <Dialog open={!!editingMessage} onOpenChange={() => setEditingMessage(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <h2 className="text-lg font-semibold mb-4">Edit Message</h2>
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setEditingMessage(null)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={() => handleUpdateMessage(editingMessage?.id || editingMessage?._id, editContent)}
                                className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                            >
                                Save
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!messageToDelete} onOpenChange={() => setMessageToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete message</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this message?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => handleDeleteMessage(messageToDelete?.id || messageToDelete?._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    );
};

Chatbox.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Chatbox;