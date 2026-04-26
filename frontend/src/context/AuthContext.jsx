import { createContext, useContext, useEffect, useState } from "react";
import api from '../utils/axiosInstance'


const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Load user from backend
    const loadUser = async () => {
        try {
            const { data } = await api.get("/users/profile")
            setUser(data.data)
            
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUser()
    }, [])

    const login = (userData) => {
        setUser(userData)
    }

    const logout = async () => {
        try {
            await api.post("/users/logout")
        } catch { }

        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                role: user?.role,
                isAuthenticated: !!user,
                loading,
                login,
                logout,
                refreshUser: loadUser
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)