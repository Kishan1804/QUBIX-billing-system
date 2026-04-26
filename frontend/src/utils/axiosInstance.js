import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/login")) {
            originalRequest._retry = true

            try {
                await axiosInstance.post("/users/refresh-token",)
                return axiosInstance(originalRequest)
                
            } catch (err) {
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance