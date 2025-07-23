import instance from "../CustomizeApi"


export const updateSaleManagerProfile = (formData) => {
    return instance.put('/saleManager/profile', formData)
}

export const updateProfile = updateSaleManagerProfile;

export const changeSaleManagerPassword = (currentPassword, newPassword) => {
    return instance.put('/saleManager/change-password', { currentPassword, newPassword })
}

// Task Management APIs
export const getAllTasks = () => {
    return instance.get('/saleManager/task/get-tasks')
}

export const createTask = (taskData) => {
    return instance.post('/saleManager/task/create-task', taskData)
}

export const updateTask = (taskId, taskData) => {
    return instance.put(`/saleManager/task/update-task/${taskId}`, taskData)
}

export const deleteTask = (taskId) => {
    return instance.delete(`/saleManager/task/delete-task/${taskId}`)
}

export const getTaskById = (taskId) => {
    return instance.get(`/saleManager/task/get-task/${taskId}`)
}

// Task Assignment APIs
export const getAllTaskAssignments = () => {
    return instance.get('/saleManager/taskAssignment/assigned-tasks')
}

export const getAssignedTasks = (staffId) => {
    const url = staffId
        ? `/saleManager/taskAssignment/assigned-tasks?staffId=${staffId}`
        : '/saleManager/taskAssignment/assigned-tasks';
    return instance.get(url);
}

export const createTaskAssignment = (assignmentData) => {
    return instance.post('/saleManager/taskAssignment/assign', assignmentData)
}

export const updateTaskAssignment = (assignmentId, assignmentData) => {
    return instance.put(`/saleManager/taskAssignment/update-status/${assignmentId}`, assignmentData)
}

// Xóa/hủy gán task cho nhân viên (dùng cho filter theo sale manager)
export const removeTaskAssignment = (assignmentId) => {
    return instance.delete(`/saleManager/taskAssignment/remove/${assignmentId}`)
}

export const getTaskAssignmentById = (assignmentId) => {
    return instance.get(`/saleManager/taskAssignment/assigned-tasks/${assignmentId}`)
}

export const assignTaskToAllStaff = (taskId, deadline, notes) => {
    return instance.post('/saleManager/taskAssignment/assign-all', { taskId, deadline, notes })
}

// Discount Management APIs
export const getAllDiscounts = () => {
    return instance.get('/saleManager/discount');
}

export const createDiscount = (discountData) => {
    return instance.post('/saleManager/discount', discountData);
}

export const updateDiscount = (discountId, discountData) => {
    return instance.put(`/saleManager/discount/${discountId}`, discountData);
}

export const deleteDiscount = (discountId) => {
    return instance.delete(`/saleManager/discount/${discountId}`);
}

export const getDiscountById = (discountId) => {
    return instance.get(`/saleManager/discount/${discountId}`);
}

export const toggleDiscountActive = (discountId) => {
    return instance.patch(`/saleManager/discount/${discountId}/toggle`);
}

export const applyDiscount = (data) => {
    return instance.post('/saleManager/discount/apply', data);
}

// Order Management APIs
export const getAllOrders = () => {
    return instance.get('/saleManager/order/')
}

export const assignAllOrdersToStaff = () => {
    return instance.post('/saleManager/order/assign-all');
}

export const getOrderById = (orderId) => {
    return instance.get(`/saleManager/order/${orderId}`)
}

export const updateOrderStatus = (orderId, status) => {
    return instance.patch(`/saleManager/order/${orderId}/status`, { status })
}

export const assignOrder = (orderId, staffId) => {
    return instance.post(`/saleManager/order/${orderId}/assign`, { staffId })
}

export const deleteOrder = (orderId) => {
    return instance.delete(`/saleManager/order/${orderId}`)
}

export const listOrderAssignment = () => {
    return instance.get('/saleManager/order/assignment/list')
}

export const getOrderAssignmentById = (assignmentId) => {
    return instance.get(`/saleManager/order/assignment/${assignmentId}`)
}


// Statistics APIs
export const overview = () => {
    return instance.get('/saleManager/statistics/overview')
}

export const productStatistics = () => {
    return instance.get('/saleManager/statistics/products')
}

export const orderStatistics = () => {
    return instance.get('/saleManager/statistics/orders')
}

export const customersStatistics = () => {
    return instance.get('/saleManager/statistics/customers')
}

// Export statistics to Excel
export const exportStatisticsExcel = () => {
    return instance.get('/saleManager/statistics/export-excel', { responseType: 'blob' });
}

// Chat APIs
export const getChatMessages = (receiverId) => {
    return instance.get(`/chat/history/${receiverId}`)
}

export const sendChatMessage = (receiverId, content) => {
    return instance.post('/chat/send', { receiverId, content })
}

export const updateChatMessage = (messageId, content) => {
    return instance.put(`/chat/update/${messageId}`, { content })
}

export const deleteChatMessage = (messageId) => {
    return instance.delete(`/chat/delete/${messageId}`)
}

// Lấy toàn bộ user cho chat
export const getAllChatUsers = () => {
    return instance.get('/chat/users/all');
}

// Staff Management APIs
export const getAllSaleStaff = () => {
    return instance.get('/saleManager/task/getAllSaleStaff')
}

export const getStaffById = (staffId) => {
    return instance.get(`/saleManager/staff/${staffId}`)
}

export const updateStaffRole = (staffId, role) => {
    return instance.put(`/saleManager/changeRole/${staffId}`, { role })
}

export const getProfile = () => {
    return instance.get('/saleManager/profile');
}

export const getAllUsers = () => {
    return instance.get("/saleManager/users");
};

export const getMyOrderById = (orderId) => {
    return instance.get(`/saleManager/order/${orderId}`)
}
//order statistics
export const getOrderStatistics = () => {
    return instance.get('/saleManager/order/statistics/orders')
}

// Dashboard Statistics API
export const getDashboardStats = () => {
    return instance.get('/saleManager/statistics/overview')
}

