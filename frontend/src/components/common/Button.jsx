import React from 'react'

const Button = ({ children, variant = "primary", className = "", icon: Icon, ...props }) => {

    const styles = {
        primary: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-center leading-5",
        danger: "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-center leading-5",
        outline: "border border-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 hover:cursor-pointer hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-center leading-5",
        white: "border border-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 hover:cursor-pointer hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-center leading-5",
        danger_outline: "border-none text-red-600 hover:bg-red-50 hover:cursor-pointer justify-between flex w-full items-center ",
        black: "bg-black text-white px-6 py-2 rounded hover:cursor-pointer hover:bg-black/80",
    }

    return (
        <button {...props} className={`cursor-pointer transition-colors duration-300 ease-in-out h-10 px-3 py-2 rounded-lg inline-flex items-center justify-center gap-3 text-sm font-medium whitespace-nowrap ${styles[variant]} ${className}`}>
            {Icon && (
                <Icon size={16} />
            )}
            {children}
        </button>
    )
}

export default Button