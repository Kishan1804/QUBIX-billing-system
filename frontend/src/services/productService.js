import api from '../utils/axiosInstance'

export const addProducts = (productData) => {
    return api.post("/products/add", productData)
}

export const updateProducts = (id, data) => {
    return api.put(`/products/edit/${id}`, data)
}

export const deleteProducts = (id) => {
    return api.delete(`/products/delete/${id}`)
}

export const getProducts = () => {
    return api.get("/products/list")
}