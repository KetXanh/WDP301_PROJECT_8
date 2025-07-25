import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Send, X } from 'lucide-react';
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogContent } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { toast } from 'sonner';
import { chatWithAI } from '../../services/Chatbot/ApiChatAI';

const ChatAI = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]); // {role: 'user'|'ai', content: string, timestamp: Date}
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm h-[450px] p-0 sm:max-w-[400px] fixed bottom-10 right-20">
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 z-10 hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
          </Button>
          {/* Header */}
          <div className="p-2 border-b bg-gradient-to-r from-green-600/10 to-amber-600/10 flex items-center gap-2">
            <span className="font-semibold text-sm">Chat với AI (Gemini)</span>
          </div>
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-2 bg-gradient-to-b from-white to-muted/30">
            <div className="space-y-2">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-2 py-1 text-xs shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-green-600 to-amber-600 text-white' : 'bg-white text-gray-800'}`}>
                    <p>{msg.content}</p>
                    <span className={`text-[10px] opacity-70 ${msg.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {format(new Date(msg.timestamp), 'HH:mm')}
                    </span>
                  </div>
                </div>
              ))}
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
              {loading ? <span className="animate-spin">🤖</span> : <Send className="h-3 w-3" />}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatAI;