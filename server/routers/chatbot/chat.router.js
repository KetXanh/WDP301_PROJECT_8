const express = require('express');
const router = express.Router();
const chatController = require('../../controller/chatbox/chatController');
const { authenticateToken } = require("../../middleware/auth");

router.post('/chatWithAI', chatController.chatWithAI);
router.post('/send', authenticateToken, chatController.sendMessage);
router.get('/history/:otherUserId', authenticateToken, chatController.getChatHistory);
router.delete('/delete/:messageId', authenticateToken, chatController.deleteMessage);
router.put('/update/:messageId', authenticateToken, chatController.updateMessage);
router.get('/users', authenticateToken, chatController.getChatUsers);
router.get('/users/all', chatController.getAlltUsers);
router.get('/receiver/:receiverId', authenticateToken, chatController.getReceiverUser);
router.get('/all-users', authenticateToken, chatController.getAllUsersForChat);

module.exports = router; 