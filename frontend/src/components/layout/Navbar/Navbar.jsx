import { useState } from 'react'
import { LogOut, Menu } from 'lucide-react'
import Button from '../../common/Button'
import { navbarConfig } from '../../../config/navbarConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import NavbarItem from './NavbarItem';

const Navbar = () => {

    const { logout, role } = useAuth()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const menuItems = navbarConfig[role] || []

    const handleLogOut = () => {
        logout()
        toast.success("Logged out")
        navigate('/login')
    }

    if (!role) return null

    return (
        <>
            {/* MOBILE HEADER */}
            <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-slate-200 px-4 h-14">

                <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-slate-100 transition">
                    <Menu size={20} />
                </button>

                <span className="font-semibold text-slate-800">
                    QUBIX
                </span>

                <div />
            </div>

            {/* MOBILE MENU */}
            {open && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />

                    <div className="fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 shadow-xl z-50 p-6 flex flex-col">

                        <div className="text-xl font-bold text-slate-800 mb-8">
                            QUBIX
                        </div>

                        <nav className="flex flex-col gap-2">
                            {menuItems.map((item) => (
                                <NavbarItem
                                    key={item.label}
                                    label={item.label}
                                    path={item.path}
                                    icon={item.icon}
                                />
                            ))}
                        </nav>

                        <div className="mt-auto pt-6">
                            <Button onClick={handleLogOut} children="Logout" variant="danger" />
                        </div>

                    </div>
                </>
            )}

            {/* DESKTOP NAVBAR */}
            <div className="hidden md:flex sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 h-16">

                    <div className="text-xl font-bold tracking-tight text-slate-800">
                        QUBIX
                    </div>

                    <nav className="flex items-center gap-2">
                        {menuItems.map((item) => (
                            <NavbarItem
                                key={item.label}
                                label={item.label}
                                path={item.path}
                                icon={item.icon}
                            />
                        ))}
                    </nav>

                    <Button onClick={handleLogOut} children="Logout" variant="danger" />

                </div>
            </div>
        </>
    )
}

export default Navbar