const ChatMessage = require('../../models/chatMessage');
const { db } = require('../../config/firebase');
const Users = require('../../models/user');

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

    const chatHistory = messages.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
      isCurrentUser: doc.data().senderId === currentUserId.toString()
    }));

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

exports.getChatUsers = async (req, res) => {
  try {
    const currentUserId = req.user.toString();

    const messages = await db.collection('messages')
      .where('senderId', '==', currentUserId)
      .get();

    const receivedMessages = await db.collection('messages')
      .where('receiverId', '==', currentUserId)
      .get();

    const uniqueUserIds = new Set();

    messages.docs.forEach(doc => {
      const data = doc.data();
      if (data.receiverId) {
        uniqueUserIds.add(data.receiverId);
      }
    });

    receivedMessages.docs.forEach(doc => {
      const data = doc.data();
      if (data.senderId) {
        uniqueUserIds.add(data.senderId);
      }
    });

    const userIds = Array.from(uniqueUserIds);

    const users = await Users.find(
      { _id: { $in: userIds } },
      { password: 0, token: 0, deletedAt: 0 }
    ).lean();

    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      name: user.userName || 'Unknown User',
      email: user.email || '',
      avatar: user.avatar || '',
      role: user.role
    }));

    res.status(200).json(formattedUsers);
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
