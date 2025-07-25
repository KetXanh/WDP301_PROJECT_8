const ChatMessage = require('../../models/chatMessage');
const { db } = require('../../config/firebase');
const Users = require('../../models/user');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { TRAINING_DATA, SYSTEM_PROMPT } = require('../../data/chatbotTraining');
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

module.exports.chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Tạo prompt với context và training data
    let fullPrompt = SYSTEM_PROMPT + "\n\n";

    // Thêm context nếu có
    if (context) {
      fullPrompt += `Context: ${context}\n\n`;
    }

    // Tìm và thêm training data phù hợp
    let matchedCategory = null;
    let matchedPattern = null;

    // Kiểm tra từng category trong training data
    for (const [category, data] of Object.entries(TRAINING_DATA)) {
      const matched = data.patterns.find(pattern =>
        message.toLowerCase().includes(pattern.toLowerCase())
      );
      if (matched) {
        matchedCategory = category;
        matchedPattern = matched;
        break;
      }
    }

    // Thêm training data nếu tìm thấy pattern phù hợp
    if (matchedCategory && matchedPattern) {
      const responses = TRAINING_DATA[matchedCategory].responses;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      fullPrompt += `Đây là một câu hỏi về ${matchedCategory}. Mẫu câu trả lời: "${randomResponse}"\n\n`;
    }

    // Thêm câu hỏi của người dùng
    fullPrompt += `User: ${message}\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiReply = response.text();

    res.json({
      reply: aiReply,
      context: context || null,
      matchedCategory: matchedCategory || null
    });
  } catch (error) {
    console.error(
      "Error in chatWithAI:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to generate AI reply",
      details: error.response?.data || error.message,
    });
  }
};



// Gửi tin nhắn mới
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user;
    console.log(senderId);
    if (!senderId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = new ChatMessage(senderId, receiverId, content);
    const messageId = await message.save();

    res.status(201).json({
      message: 'Message sent successfully',
      messageId
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({
      message: 'Error sending message',
      error: error.message
    });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const currentUserId = req.user;
    const { otherUserId } = req.params;

    if (!otherUserId) {
      return res.status(400).json({ message: 'Missing other user ID' });
    }
    const messages = await db.collection('messages')
      .where('senderId', 'in', [currentUserId.toString(), otherUserId])
      .where('receiverId', 'in', [currentUserId.toString(), otherUserId])
      .get();

    const chatHistory = messages.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        senderId: data.senderId && data.senderId._id ? data.senderId._id.toString() : (typeof data.senderId === 'string' ? data.senderId : ''),
        receiverId: data.receiverId && data.receiverId._id ? data.receiverId._id.toString() : (typeof data.receiverId === 'string' ? data.receiverId : ''),
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp,
        isCurrentUser: data.senderId === currentUserId.toString()
      }
    });

    chatHistory.sort((a, b) => b.timestamp - a.timestamp);

    res.status(200).json(chatHistory);
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({
      message: 'Error getting chat history',
      error: error.message
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user;

    const messageDoc = await db.collection('messages').doc(messageId).get();

    if (!messageDoc.exists) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const message = messageDoc.data();

    if (message.senderId !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await db.collection('messages').doc(messageId).delete();

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting message',
      error: error.message
    });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const currentUserId = req.user;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const messageRef = db.collection('messages').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const message = messageDoc.data();

    if (message.senderId !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this message' });
    }

    await messageRef.update({
      content,
      updatedAt: new Date()
    });

    res.status(200).json({
      message: 'Message updated successfully',
      updatedMessage: {
        id: messageId,
        content,
        senderId: message.senderId,
        receiverId: message.receiverId,
        timestamp: message.timestamp,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error in updateMessage:', error);
    res.status(500).json({
      message: 'Error updating message',
      error: error.message
    });
  }
};

exports.getAlltUsers = async (req, res) => {
  try {
    const users = await Users.find().lean();
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      username: user.username || user.userName || 'Unknown User',
      email: user.email || '',
      avatar: user.avatar?.url || user.avatar || '',
      role: user.role
    }));
    res.json({ code: 200, message: "Lấy danh sách người dùng thành công", users: formattedUsers });
  } catch (error) {
    console.error('Error in getAlltUsers:', error);
    res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
  }
}


exports.getChatUsers = async (req, res) => {
  try {
    const currentUserId =
      req.user && req.user._id
        ? req.user._id.toString()
        : req.user
          ? req.user.toString()
          : null;

    if (!currentUserId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { search = "" } = req.query;

    // Nếu có search, trả về user phù hợp
    if (search) {
      const query = {
        _id: { $ne: currentUserId },
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
      const users = await Users.find(query, { password: 0, token: 0, deletedAt: 0 }).lean();
      const formattedUsers = users.map(user => ({
        _id: user._id.toString(),
        username: user.username || user.userName || 'Unknown User',
        email: user.email || '',
        avatar: user.avatar?.url || user.avatar || '',
        role: user.role
      }));
      return res.status(200).json({ users: formattedUsers });
    }

    // Nếu không có search, lấy user đã chat gần đây
    // Lấy tất cả message có liên quan đến currentUserId
    const recentMessages = await ChatMessage.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId }
      ]
    }).sort({ updatedAt: -1, createdAt: -1 }).lean();

    // Lấy danh sách userId đã chat (trừ chính mình)
    const userIds = new Set();
    recentMessages.forEach(msg => {
      if (msg.sender && msg.sender.toString() !== currentUserId) userIds.add(msg.sender.toString());
      if (msg.receiver && msg.receiver.toString() !== currentUserId) userIds.add(msg.receiver.toString());
    });

    if (userIds.size === 0) {
      // Nếu chưa từng chat với ai, trả về rỗng
      return res.status(200).json({ users: [] });
    }

    // Lấy thông tin user đã chat gần đây
    const users = await Users.find({ _id: { $in: Array.from(userIds) } }, { password: 0, token: 0, deletedAt: 0 }).lean();
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      username: user.username || user.userName || 'Unknown User',
      email: user.email || '',
      avatar: user.avatar?.url || user.avatar || '',
      role: user.role
    }));
    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error('Error in getChatUsers:', error);
    res.status(500).json({
      message: 'Error getting chat users',
      error: error.message
    });
  }
};

// Lấy thông tin người nhận tin nhắn
exports.getReceiverUser = async (req, res) => {
  try {
    const { receiverId } = req.params;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    // Lấy thông tin user từ MongoDB
    const user = await Users.findOne(
      { _id: receiverId },
      { password: 0, token: 0, deletedAt: 0 } // Loại bỏ các trường nhạy cảm
    ).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format lại dữ liệu user
    const formattedUser = {
      _id: user._id.toString(),
      name: user.userName || 'Unknown User',
      email: user.email || '',
      avatar: user.avatar || '',
      role: user.role
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    console.error('Error in getReceiverUser:', error);
    res.status(500).json({
      message: 'Error getting receiver user',
      error: error.message
    });
  }
};

exports.getAllUsersForChat = async (req, res) => {
  try {
    let currentUserRaw = req.user;
    const currentUser = await Users.findOne({ email: currentUserRaw.email });
    const currentUserId = currentUser._id.toString();

    if (!currentUserId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const { search = "" } = req.query;
    const query = {
      _id: { $ne: currentUserId },
    };
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await Users.find(query, { password: 0, token: 0, deletedAt: 0 }).lean();
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      username: user.username || user.userName || 'Unknown User',
      email: user.email || '',
      avatar: user.avatar?.url || user.avatar || '',
      role: user.role
    }));
    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error('Error in getAllUsersForChat:', error);
    res.status(500).json({
      message: 'Error getting all users for chat',
      error: error.message
    });
  }
};
