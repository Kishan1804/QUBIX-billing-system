import React from 'react'

const Statcard = ({ title, value, desc, icon: Icon, color }) => {
  return (
    <>
      <div className='rounded-lg border border-slate-200 shadow-sm bg-white hover:shadow-md transition duration-300 hover:-translate-y-1'>
        <div className='p-6 flex flex-row items-center justify-between space-y-0 pb-2'>
          <div className='tracking-tight text-base font-semibold'>{title}</div>
          <Icon size={20} className={color} />
        </div>
        <div className='p-6 pt-0'>
          <div className='text-2xl font-bold'>{value}</div>
          <p className='text-xs mt-1 text-gray-400'>{desc}</p>
        </div>
      </div>
    </>
  )
}

export default Statcard