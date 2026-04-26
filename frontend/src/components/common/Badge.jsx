import React from 'react'

const Badge = ({ status, customStyle, title }) => {
    const colors = {
        paid: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        overdue: "bg-red-100 text-red-700"
    };
    return (
        <span className={`px-2 py-1 rounded-4xl text-xs font-medium ${colors[status]} ${customStyle}`}>
            {title}
        </span>
    )
}

export default Badge