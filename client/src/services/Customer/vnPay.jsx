import instance from "../CustomizeApi"

export const createPaymentUrl = (data) => {
    return instance.post(`/user/vnpay/create_payment_url`, data);
}