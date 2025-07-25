import instance from "../CustomizeApi";

// Gửi câu hỏi tới AI (Google Gemini)
export const chatWithAI = (message, context = null) => {
  return instance.post('/chat/chatWithAI', { message, context });
};
