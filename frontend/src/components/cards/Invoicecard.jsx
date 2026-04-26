import Badge from '../common/Badge'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
}

const Invoicecard = ({ downloadPDF, viewPDF, handleInvoiceDetail, handlePayment, inv, payButton = false }) => {

  const colors = {
    paid: "bg-gradient-to-br from-green-100 via-green-50 to-white border border-green-200 hover:shadow-md transition",
    pending: "bg-gradient-to-br from-yellow-100 via-yellow-50 to-white border border-yellow-200 hover:shadow-md transition",
    overdue: "bg-gradient-to-br from-red-100 via-red-50 to-white border border-red-200 hover:shadow-md transition"
  };

  return (
    <>
      <div className={`border cursor-pointer rounded-lg p-4 transform transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 ${colors[inv.status]}`}>

        <div className='flex items-start justify-between pb-5'>
          <div>
            <h1 className='text-lg font-semibold'>{inv.invoiceNumber}</h1>
            <p className='text-sm text-gray-500'>{formatDate(inv.createdAt)}</p>
          </div>

          <Badge status={inv.status} title={inv.status} />
        </div>

        <div className='space-y-1'>
          <div className='flex justify-between'>
            <h4 className=''>Items:</h4>
            <p className='font-semibold'>{inv.items.length}</p>
          </div>

          <div className='flex justify-between'>
            <h4 className=''>Subtotal:</h4>
            <p className='font-semibold'>₹{inv.subTotal}</p>
          </div>

          <div className='flex justify-between border-b-2 border-slate-300 pb-2'>
            <h4 className=''>Tax%:</h4>
            <p className='font-semibold'>{inv.taxPercent}%</p>
          </div>

          <div className='flex justify-between pt-2 text-lg'>
            <h4 className='font-semibold'>Total</h4>
            <p className='font-bold'>₹{inv.totalAmount}</p>
          </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-3'>
          <button onClick={handleInvoiceDetail} className='col-span-2 rounded-lg cursor-pointer text-white bg-linear-to-r from-slate-500 via-slate-600 to-slate-700 hover:bg-linear-to-br focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-slate-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5'>View Details</button>

          <button onClick={viewPDF} className='rounded-lg cursor-pointer text-white bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-linear-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5'>View PDF</button>

          <button onClick={downloadPDF} className='rounded-lg cursor-pointer text-white bg-linear-to-r from-green-400 via-green-500 to-green-600 hover:bg-linear-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5'>Download PDF</button>


          {payButton && inv.status !== 'paid' && (
            <button onClick={handlePayment} className='col-span-2 rounded-lg bg-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-700 transition'>Pay Bill (₹{inv.totalAmount})</button>
          )}

        </div>
      </div>
    </>
  )
}

export default Invoicecard