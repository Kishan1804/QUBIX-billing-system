import api from '../utils/axiosInstance'

export const registerUser = (userData) => {
    return api.post("/users/register", userData)
}

export const loginUser = (email, password) => {
    return api.post("/users/login", { email, password })
}

export const logoutUser = () => {
    return api.post("/users/logout")
}

export const getProfile = () => {
    return api.get("/users/profile")
}

export const getUsers = () => {
    return api.get("/users/list")
}

export const updateUser = (id, data) => {
    return api.put(`/users/edit/${id}`, data)
}

export const deleteUser = (id) => {
    return api.delete(`/users/delete/${id}`)
}

export const sendOtp = (email) => {
    return api.post('/users/send-otp', { email })
}

export const resetPassword = (email, otp, password) => {
    return api.post('/users/reset-password', { email, otp, password })
}