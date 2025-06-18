import instance from "../CustomizeApi"

export const customerLogin = ({ email, password }) => {
    return instance.post('/auth/login', { email, password })
}
export const customerRegister = (username, email, password) => {
    return instance.post('/user/auth/register', { username, email, password })
}
export const customerVerify = (email, otp) => {
    return instance.post('/user/auth/verify-email', { otp, email })
}

export const customerResendOtp = (email) => {
    return instance.post('/user/auth/resend-otp', { email })
}
export const customerProfile = () => {
    return instance.get('/user/auth/profile')
}

export const customerForgotPass = (email) => {
    return instance.post('/user/auth/forgot-password', { email })
}

export const otpForgotPass = (otp, email) => {
    return instance.post('/user/auth/otp-forgot', { otp, email })
}
export const resetPass = (email, password) => {
    return instance.post('/user/auth/reset-password', { email, password })
}

export const loginGooogle = (email, name, picture) => {
    return instance.post('/user/auth/login-google', { email, name, picture })
}
export const getProfile = () => {
    return instance.get('/user/auth/profile')
}
export const updateProfile = (formData) => {
    return instance.post('/user/auth/profile', formData)
} 