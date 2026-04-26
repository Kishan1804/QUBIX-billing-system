import api from '../utils/axiosInstance'

export const generateNumber = () => {
    return api.get("/invoices/generate-number")
}

export const createInvoice = (invoiceData) => {
    return api.post("/invoices/create", invoiceData)
}

export const getInvoices = () => {
    return api.get("/invoices/list")
}

export const detailInvoice = (id) => {
    return api.get(`/invoices/detail/${id}`)
}

export const viewInvoicePDF = (id) => {
    return api.get(`/invoices/view-pdf/${id}`)
}

export const downloadInvoicePDF = (id) => {
    return api.get(`/invoices/download-pdf/${id}`, {
        responseType: "blob"
    })
}