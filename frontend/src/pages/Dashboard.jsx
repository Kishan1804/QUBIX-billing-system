import React from 'react'
import AdminDashboard from '../components/dashboards/AdminDashboard'
import CustomerDashboard from '../components/dashboards/CustomerDashboard'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { role } = useAuth()
  return (
    <div className="space-y-6">

      {role === "admin" && <AdminDashboard />}
      {role === "customer" && <CustomerDashboard />}

    </div>
  )
}

export default Dashboard