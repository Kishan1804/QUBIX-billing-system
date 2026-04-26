import { NavLink } from 'react-router-dom'

const NavbarItem = ({ label, icon: Icon, path }) => {
    return (
        <NavLink
            to={path}
            className={({ isActive }) => `whitespace-nowrap gap-2 font-medium flex items-center px-2 py-1.5 rounded-lg ${isActive ? "bg-blue-100 text-blue-800 font-semibold" : "hover:bg-neutral-100 hover:text-blue-800"}`}>
            <Icon size={18} /> {label}
        </NavLink>
    )
}

export default NavbarItem