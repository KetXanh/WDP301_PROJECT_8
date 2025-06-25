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
    return instance.get('/task/getAllTask')
}

export const createTask = (taskData) => {
    return instance.post('/task/createTask', taskData)
}

export const updateTask = (taskId, taskData) => {
    return instance.put(`/task/updateTask/${taskId}`, taskData)
}

export const deleteTask = (taskId) => {
    return instance.delete(`/task/deleteTask/${taskId}`)
}

export const getTaskById = (taskId) => {
    return instance.get(`/task/getTaskById/${taskId}`)
}

// Task Assignment APIs
export const getAllTaskAssignments = () => {
    return instance.get('/taskAssignment/getAllTaskAssignment')
}

export const createTaskAssignment = (assignmentData) => {
    return instance.post('/taskAssignment/createTaskAssignment', assignmentData)
}

export const updateTaskAssignment = (assignmentId, assignmentData) => {
    return instance.put(`/taskAssignment/updateTaskAssignment/${assignmentId}`, assignmentData)
}

export const deleteTaskAssignment = (assignmentId) => {
    return instance.delete(`/taskAssignment/deleteTaskAssignment/${assignmentId}`)
}

export const getTaskAssignmentById = (assignmentId) => {
    return instance.get(`/taskAssignment/getTaskAssignmentById/${assignmentId}`)
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
    return instance.get('/saleManager/orders')
}

export const getOrderById = (orderId) => {
    return instance.get(`/saleManager/orders/${orderId}`)
}

export const updateOrderStatus = (orderId, status) => {
    return instance.put(`/saleManager/orders/${orderId}/status`, { status })
}

export const assignOrder = (orderId, staffId) => {
    return instance.put(`/saleManager/orders/${orderId}/assign`, { staffId })
}

// Statistics APIs
export const getDashboardStats = () => {
    return instance.get('/saleManager/dashboard/stats')
}

export const getSalesStats = (period) => {
    return instance.get(`/saleManager/stats/sales?period=${period}`)
}

export const getTaskStats = () => {
    return instance.get('/saleManager/stats/tasks')
}

export const getKPIStats = () => {
    return instance.get('/saleManager/stats/kpis')
}

// Chat APIs
export const getChatMessages = (receiverId) => {
    return instance.get(`/saleManager/chat/messages/${receiverId}`)
}

export const sendChatMessage = (receiverId, message) => {
    return instance.post('/saleManager/chat/send', { receiverId, message })
}

export const getChatContacts = () => {
    return instance.get('/saleManager/chat/contacts')
}

// Staff Management APIs
export const getAllSaleStaff = () => {
    return instance.get('/saleManager/staff')
}

export const getStaffById = (staffId) => {
    return instance.get(`/saleManager/staff/${staffId}`)
}

export const updateStaffRole = (staffId, role) => {
    return instance.put(`/saleManager/staff/${staffId}/role`, { role })
}

export const getProfile = () => {
    return instance.get('/saleManager/profile');
}


export const getMyOrderById = (orderId) => {
    return instance.get(`/saleManager/orders/${orderId}`)
}