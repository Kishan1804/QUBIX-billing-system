import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/login")) {
            originalRequest._retry = true

            try {
                await axios.post(
                    "http://localhost:8000/api/v1/users/refresh-token",
                    {},
                    { withCredentials: true }
                )

                return axiosInstance(originalRequest)
            } catch (err) {
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance