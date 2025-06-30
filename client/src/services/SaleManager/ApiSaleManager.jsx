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

export const createTaskAssignment = (assignmentData) => {
    return instance.post('/saleManager/taskAssignment/assign', assignmentData)
}

export const updateTaskAssignment = (assignmentId, assignmentData) => {
    return instance.put(`/saleManager/taskAssignment/update-status/${assignmentId}`, assignmentData)
}

export const deleteTaskAssignment = (assignmentId) => {
    return instance.delete(`/saleManager/taskAssignment/remove/${assignmentId}`)
}

export const getTaskAssignmentById = (assignmentId) => {
    return instance.get(`/saleManager/taskAssignment/assigned-tasks/${assignmentId}`)
}

// KPI Management APIs
export const getAllKPIs = () => {
    return instance.get('/saleManager/kpis')
}

export const createKPI = (kpiData) => {
    return instance.post('/saleManager/kpis', kpiData)
}

export const updateKPI = (kpiId, kpiData) => {
    return instance.put(`/saleManager/kpis/${kpiId}`, kpiData)
}

export const deleteKPI = (kpiId) => {
    return instance.delete(`/saleManager/kpis/${kpiId}`)
}

// Discount Management APIs
export const getAllDiscounts = () => {
    return instance.get('/saleManager/discounts')
}

export const createDiscount = (discountData) => {
    return instance.post('/saleManager/discounts', discountData)
}

export const updateDiscount = (discountId, discountData) => {
    return instance.put(`/saleManager/discounts/${discountId}`, discountData)
}

export const deleteDiscount = (discountId) => {
    return instance.delete(`/saleManager/discounts/${discountId}`)
}

// Order Management APIs
export const getAllOrders = () => {
    return instance.get('/saleManager/order/')
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

export const kpiStatistics = () => {
    return instance.get('/saleManager/statistics/kpi')
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

