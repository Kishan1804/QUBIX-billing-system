import Navbar from '../components/layout/Navbar/Navbar'
import { Outlet } from 'react-router-dom'


const DashboardLayout = () => {

  return (
    <div className='min-h-screen bg-slate-50'>

      <Navbar />

      <div className='max-w-7xl mx-auto px-6 py-6'>
        <Outlet />
      </div>
      
    </div>
  )
}

export default DashboardLayout