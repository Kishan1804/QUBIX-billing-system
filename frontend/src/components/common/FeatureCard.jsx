import React from 'react'

const FeatureCard = ({title, desc, color, icon:Icon, ...props}) => {
  return (
    <div className='rounded-lg border shadow-sm' >
        <div className='flex flex-col space-y-1.5 p-6'>
            <Icon size={32} className='mb-4' color={color} />
            <div className='text-2xl font-semibold leading-none tracking-tight'>{title}</div>
        </div>
        <div className='p-6 pt-0'>
            <div className='text-sm text-slate-500'>{desc}</div>
        </div>
    </div>
  )
}

export default FeatureCard