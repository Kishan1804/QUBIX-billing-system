import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})

const PUBLIC_ROUTES = [
    "/users/login",
    "/users/register",
    "/users/send-otp",
    "/users/reset-password",
    "/users/refresh-token",
]

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config

        if (PUBLIC_ROUTES.some(route => originalRequest.url.includes(route))) {
            return Promise.reject(error)
        }

        if (!document.cookie.includes("refreshToken")) {
            return Promise.reject(error)
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            try {
                await axiosInstance.post("/users/refresh-token", {})
                return axiosInstance(originalRequest)

            } catch (err) {
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance