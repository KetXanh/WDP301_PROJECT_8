import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Send, X, Bot, Sparkles } from 'lucide-react';
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogContent } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { toast } from 'sonner';
import { chatWithAI } from '../../services/Chatbot/ApiChatAI';

const ChatAI = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);

  // Message suggestions for AI chat
  const aiSuggestions = [
    "Xin chào! Bạn có thể giúp tôi gì?",
    "Tôi muốn tìm hiểu về sản phẩm của NutiGo",
    "Cách đặt hàng online như thế nào?",
    "Chính sách đổi trả sản phẩm ra sao?",
    "Tôi có thể thanh toán bằng cách nào?",
    "Thời gian giao hàng mất bao lâu?",
    "Có chương trình khuyến mãi nào không?",
    "Tôi muốn liên hệ với nhân viên hỗ trợ"
  ];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto scroll when loading state changes
  useEffect(() => {
    if (!loading) {
      setTimeout(scrollToBottom, 100);
    }
  }, [loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const userMsg = { role: 'user', content: newMessage, timestamp: new Date() };
    setMessages(msgs => [...msgs, userMsg]);
    setNewMessage('');
    setLoading(true);
    
    try {
      const res = await chatWithAI(userMsg.content);
      const aiReply = res.data.reply || 'AI không trả lời.';
      setMessages(msgs => [...msgs, { role: 'ai', content: aiReply, timestamp: new Date() }]);
    } catch {
      toast.error('Lỗi khi chat với AI');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setNewMessage(suggestion);
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

          {/* AI Info Sidebar - Hidden on mobile */}
          <div className="hidden md:block w-32 border-r flex flex-col bg-muted/50">
            <div className="p-2 border-b bg-gradient-to-r from-green-600/10 to-amber-600/10">
              <h3 className="font-semibold text-sm">AI Assistant</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center mb-3">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium text-sm mb-1">NutiGo AI</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Trợ lý thông minh
              </p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>

            {/* AI Status Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50">
              <div className="text-center">
                <p className="text-xs text-gray-600 font-medium">AI Assistant</p>
                <p className="text-xs text-gray-500">Version 1.0</p>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-2 border-b bg-gradient-to-r from-green-600/10 to-amber-600/10 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">NutiGo AI Assistant</h3>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-muted-foreground">Online - Sẵn sàng hỗ trợ</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-2 bg-gradient-to-b from-white to-muted/30">
              <div className="space-y-2 min-h-full">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <div className="text-2xl mb-2">🤖</div>
                    <h3 className="text-sm font-medium mb-1 text-center">Chào bạn!</h3>
                    <p className="text-xs text-center mb-4">
                      Tôi là AI assistant, hãy hỏi tôi bất cứ điều gì
                    </p>
                    
                    {/* Message Suggestions */}
                    <div className="w-full space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        <span>Gợi ý tin nhắn:</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {aiSuggestions.slice(0, 4).map((suggestion, index) => (
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
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex items-end gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-lg px-2 py-1 text-xs shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-green-600 to-amber-600 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        <p className={`${msg.role === 'user' ? 'text-white' : 'text-gray-800'} whitespace-pre-wrap break-words`}>
                          {msg.content}
                        </p>
                        <span className={`text-[10px] opacity-70 ${
                          msg.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {format(new Date(msg.timestamp), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex items-end gap-1 justify-start">
                    <div className="max-w-[85%] rounded-lg px-2 py-1 text-xs shadow-sm bg-white border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                        <span className="text-gray-600">AI đang trả lời...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-2 border-t bg-white flex gap-1">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="min-h-[32px] max-h-[60px] resize-none rounded-full px-3 py-1 text-xs"
                disabled={loading}
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
                disabled={!newMessage.trim() || loading}
                className="h-8 w-8 rounded-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-3 w-3" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatAI;