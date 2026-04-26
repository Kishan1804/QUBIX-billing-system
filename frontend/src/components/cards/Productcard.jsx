import React from 'react'

const Productcard = ({ product }) => {
    return (
        <>
            <div className='bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition duration-300 cursor-pointer group'>
                <div className='h-48 overflow-hidden bg-slate-100'>
                    <img className='w-full h-full object-cover group-hover:scale-110 transition duration-500' src={product.image} alt={product.name} />
                </div>


                <div className='p-4 space-y-1'>
                    <h2 className='text-lg font-semibold text-slate-800 line-clamp-1'>{product.name}</h2>
                    <span className='text-sm text-slate-400 line-clamp-2'>{product.description}</span>
                    <div className='flex items-center justify-between pt-2'>
                        <span className='text-xl font-bold text-slate-900 line-clamp-1'>₹ {product.price}</span>

                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                            Stock - {product.stock}
                        </span>

                    </div>
                </div>

                <div className='px-4 pb-4 pt-2'>
                    <div className='text-center text-xs font-medium text-slate-500 bg-slate-50 rounded-lg py-2 group-hover:bg-blue-50 group-hover:text-blue-600 transition'> Contact staff to order</div>
                </div>

            </div>
        </>

    )
}

export default Productcard