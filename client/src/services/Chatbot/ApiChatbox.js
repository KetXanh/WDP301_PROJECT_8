import api from '../../utils/CustomizeApi';

export const sendMessage = async (receiverId, content) => {
    const response = await api.post('/chat/send', { receiverId, content });
    return response.data;
}

export const getChatHistory = async (receiverId) => {
    const response = await api.get(`/chat/history/${receiverId}`);
    return response.data;
}

export const deleteMessage = async (messageId) => {
    const response = await api.delete(`/chat/delete/${messageId}`);
    return response.data;
}

export const updateMessage = async (messageId, content) => {
    const response = await api.put(`/chat/update/${messageId}`, { content });
    return response.data;
}

export const getChatUsers = async () => {
    const response = await api.get('/chat/users');
    return response.data;
}

export const getReceiverUser = async (receiverId) => {
    const response = await api.get(`/chat/receiver/${receiverId}`);
    return response.data;
}