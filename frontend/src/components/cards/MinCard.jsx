import Badge from '../common/Badge'
import { Link } from 'react-router-dom'

const MinCard = ({ type, name, billNo, date, totalAmount, icon: Icon, status, stock }) => {

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const statusColor = {
        paid: "text-emerald-500 bg-emerald-50",
        pending: "text-amber-500 bg-amber-50",
        overdue: "text-rose-500 bg-rose-50"
    };

    return (
        <div className="flex items-center justify-between p-3 mt-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-300 cursor-pointer">

            {/* LEFT */}
            <div className='flex items-center gap-3'>
                {type === 'invoice' && (
                    <div className={`p-2 rounded-lg ${statusColor[status]}`}>
                        <Icon size={16} />
                    </div>
                )}

                <div>
                    <p className="text-sm font-semibold text-slate-800 leading-none">
                        {name}
                    </p>

                    {type === 'invoice' ? (
                        <p className="text-xs text-slate-400 mt-1">{billNo} • {formatDate(date)}</p>
                    ) : (
                        <p className="text-xs text-slate-400 mt-1">Stock {stock} • {formatDate(date)}</p>
                    )}
                </div>
            </div>


            {/* RIGHT */}
            {type === 'invoice' ? (
                <div className='text-right'>
                    <p className='text-sm font-bold text-slate-800'>
                        ₹ {totalAmount}
                    </p>
                    <p className={`text-xs font-medium mt-1 capitalize ${statusColor[status]?.split(' ')[0]}`}>
                        {status}
                    </p>
                </div>
            ) : (
                <div className='flex items-center gap-2'>
                    {stock <= 5 && <Badge status='pending' title='Low' />}
                    <Link to='/products/create' className='text-xs font-medium text-blue-500 hover:text-blue-700 transition'>
                        Restock
                    </Link>
                </div>
            )}
        </div>
    )
}

export default MinCard