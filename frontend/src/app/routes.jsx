import { Route, Routes } from 'react-router-dom'

import Home from '../pages/Home'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import ProtectedRoute from '../route/ProtectedRoute'
import Dashboard from '../pages/Dashboard'
import DashboardLayout from '../layouts/DashboardLayout'
import Products from '../pages/Products'
import ProductCreate from '../pages/ProductCreate'
import Users from '../pages/Users'
import UserCreate from '../pages/UserCreate'
import Invoices from '../pages/Invoices'
import InvoiceCreate from '../pages/InvoiceCreate'
import InvoiceDetail from '../pages/InvoiceDetail'
import Contact from '../pages/Contact'
import ManageContact from '../pages/ManageContact'
import Report from '../pages/Report'
import Profile from '../pages/Profile'
import ForgetPassword from '../pages/ForgetPassword'


const RoutesConfig = () => {
    return (
        <>
            <Routes>
                {/* Public */}
                <Route path='/' element={<Home />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={<Login />} />
                <Route path='/login/reset-password' element={<ForgetPassword />} />

                {/* Protected */}
                <Route element={<ProtectedRoute />} >
                    <Route element={<DashboardLayout />}>
                        <Route path='/dashboard' element={<Dashboard />} />

                        <Route path='/products' element={<Products />} />
                        <Route path='/products/create' element={<ProductCreate />} />

                        <Route path='/users' element={<Users />} />
                        <Route path='/users/create' element={<UserCreate />} />

                        <Route path='/invoices' element={<Invoices />} />
                        <Route path='/invoices/create' element={<InvoiceCreate />} />
                        <Route path='/invoices/:id' element={<InvoiceDetail />} />

                        <Route path='/contact' element={<Contact />} />
                        <Route path='/manage-contact' element={<ManageContact />} />

                        <Route path='/report' element={<Report />} />
                        <Route path='/profile' element={<Profile />} />

                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default RoutesConfig 