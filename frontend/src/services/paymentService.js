import api from '../utils/axiosInstance'

export const createPaymentOrder = (paymentData) => {
    return api.post("/payments/create-order", paymentData)
}

export const verifyPayment = (verifyData) => {
    return api.post("/payments/verify", verifyData)
}