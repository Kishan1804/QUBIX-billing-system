import React from 'react'

const Input = ({ label, icon: Icon, fontSize, ...props }) => {
  return (
    <div className='flex flex-col gap-2'>
      <label className={`${fontSize} font-medium leading-none`}>{label}</label>
      <div className='relative'>
        {Icon && (
          <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color="#5c5e62" />
        )}


        <input {...props} className={`h-10 w-full rounded-lg border py-2 pr-4 text-sm focus:outline-none focus:ring-1 ${Icon ? "pl-10" : "pl-4"}`} />
      </div>
    </div>
  )
}

export default Input