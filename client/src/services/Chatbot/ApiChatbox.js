import api from '../CustomizeApi'

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
    return response.data.users ? response.data.users : response.data;
}

// New API function to get only admin, sale staff, and sale manager users
export const getStaffUsers = async () => {
    const response = await api.get('/chat/staff-users');
    return response.data.users ? response.data.users : response.data;
}

export const getReceiverUser = async (receiverId) => {
    const response = await api.get(`/chat/receiver/${receiverId}`);
    return response.data;
}

export const searchAllUsersForChat = async (search) => {
    const response = await api.get('/chat/all-users', { params: { search } });
    return response.data.users ? response.data.users : response.data;
}