import instance from "../CustomizeApi"

export const createPaymentUrl = (data) => {
    return instance.post(`/user/vnpay/create_payment_url`, data);
}

export const returnVnpay = (params) => {
    return instance.get(`/user/vnpay/vnpay_return`, { params });
}