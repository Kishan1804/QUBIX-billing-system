import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config

        if(window.location.pathname === '/login') {
            return Promise.reject(error)
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/login") &&
            !originalRequest.url.includes("/refresh-token")
        ) {
            originalRequest._retry = true

            try {
                await axiosInstance.post("/users/refresh-token", {})
                return axiosInstance(originalRequest)

            } catch (err) {
                window.location.href = "/login"
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance