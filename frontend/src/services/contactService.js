import api from '../utils/axiosInstance'

export const sendContactMessage = (contactData) => {
    return api.post('/contact', contactData)
}

export const getContacts = () => {
    return api.get("/contact")
}

export const markContactRead = (id) => {
    return api.patch(`/contact/${id}/read`)
}

export const deleteContact = (id) => {
    return api.delete(`/contact/${id}`)
}