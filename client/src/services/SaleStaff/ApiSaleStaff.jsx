import instance from "../CustomizeApi"

export const changePassword = (currentPassword, newPassword) => {
    return instance.put('/auth/change-password', { currentPassword, newPassword })
}

// Profile Management
export const getProfile = () => {
    return instance.get('/auth/profile')
}

export const updateProfile = (profileData) => {
    return instance.put('/auth/profile', profileData)
}

export const uploadAvatar = (formData) => {
    return instance.post('/auth/profile/avatar', formData)
}

// Dashboard APIs
export const getDashboardData = () => {
    return instance.get('/saleStaff/dashboard')
}

export const getQuickStats = () => {
    return instance.get('/saleStaff/dashboard/quick-stats')
}

export const getRecentActivities = () => {
    return instance.get('/saleStaff/dashboard/recent-activities')
}

// Analytics APIs
export const getAnalytics = (period = 'month') => {
    return instance.get(`/saleStaff/analytics?period=${period}`)
}

export const getSalesAnalytics = (startDate, endDate) => {
    return instance.get(`/saleStaff/analytics/sales?startDate=${startDate}&endDate=${endDate}`)
}

export const getPerformanceAnalytics = (startDate, endDate) => {
    return instance.get(`/saleStaff/analytics/performance?startDate=${startDate}&endDate=${endDate}`)
}

// Export APIs
export const exportData = (type, filters) => {
    return instance.post(`/saleStaff/export/${type}`, filters, {
        responseType: 'blob'
    })
}

export const exportTasks = (filters) => {
    return instance.post('/saleStaff/export/tasks', filters, {
        responseType: 'blob'
    })
}

export const exportKPIs = (filters) => {
    return instance.post('/saleStaff/export/kpis', filters, {
        responseType: 'blob'
    })
}

export const exportOrders = (filters) => {
    return instance.post('/saleStaff/export/orders', filters, {
        responseType: 'blob'
    })
} 