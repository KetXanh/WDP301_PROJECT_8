import instance from "../CustomizeApi"

export const customerLogin = ({ email, password }) => {
    return instance.post('/auth/login', { email, password })
}
export const customerRegister = ({ username, email, password }) => {
    return instance.post('/user/auth/register', { username, email, password })
}
export const customerVerify = ({ email, otp }) => {
    return instance.post('/user/auth/verify-email', { email, otp })
}

export const customerResendOtp = ({ email }) => {
    return instance.post('/user/auth/resend-otp', { email })
}
export const customerProfile = () => {
    return instance.get('/user/auth/profile')
} 