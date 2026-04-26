import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return null
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return <Outlet />
}

export default ProtectedRoute