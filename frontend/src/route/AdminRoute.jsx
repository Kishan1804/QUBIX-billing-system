import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoadingScreen from "../components/common/LoadingScreen"


const AdminRoute = () => {
    const { isAuthenticated, auth, loading } = useAuth()

    if (loading) return <LoadingScreen />

    if (!isAuthenticated) return <Navigate to="/login" replace />

    if (auth?.role !== 'admin') return <Navigate to='/dashboard' replace     />

    return <Outlet />

}

export default AdminRoute

