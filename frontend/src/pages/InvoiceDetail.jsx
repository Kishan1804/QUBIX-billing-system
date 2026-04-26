import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { detailInvoice } from '../services/invoiceService'
import LoadingScreen from '../components/common/LoadingScreen'
import toast from 'react-hot-toast'

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
}

const formatAmount = (value) => Number(value || 0).toLocaleString('en-IN')

const InvoiceDetail = () => {

    const { id } = useParams()
    const [invoiceDetail, setInvoiceDetail] = useState([])

    const logs = invoiceDetail?.activityLogs?.slice().reverse()
    const [paymentDetail, setPaymentDetail] = useState([])

    const [loading, setLoading] = useState(false)

    const fetchInvoiceDetail = async () => {
        try {
            const { data } = await detailInvoice(id)
            const invoice = data.data

            setInvoiceDetail(invoice)

            if (invoice.paymentId) {
                setPaymentDetail([invoice.paymentId])
            }

        } catch (err) {
            toast.error("Failed to load invoice details")
        }
    }

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true)
            try {
                await Promise.all([
                    fetchInvoiceDetail(),
                ])
            } finally {
                setLoading(false)
            }
        }

        loadAll()
    }, [])

    if (loading) return <LoadingScreen text='Fetching invoice details...' />

    return (
        <div className="space-y-6">

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

                {/* HEADER */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Invoice #{invoiceDetail?.invoiceNumber}
                        </h2>
                        <p className="text-sm text-slate-400">
                            Issued on {formatDate(invoiceDetail?.createdAt)}
                        </p>
                    </div>

                    <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 font-semibold uppercase">
                        Invoice
                    </span>
                </div>

                {/* CUSTOMER + META */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
                            Bill To
                        </p>
                        <p className="font-semibold text-slate-800">
                            {invoiceDetail?.customer?.firstName} {invoiceDetail?.customer?.lastName}
                        </p>
                        <p className="text-sm text-slate-500">
                            +91 {invoiceDetail?.customer?.phone}
                        </p>
                        <p className="text-sm text-slate-500">
                            {invoiceDetail?.customer?.email}
                        </p>
                    </div>

                    <div className="sm:text-right">
                        <p className="text-sm text-slate-500">
                            Due Date: {formatDate(invoiceDetail?.dueDate)}
                        </p>
                        <p className="text-sm text-slate-500">
                            Status:
                            <span className="ml-1 font-semibold capitalize text-slate-700">
                                {invoiceDetail?.status}
                            </span>
                        </p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">

                        <thead className="bg-slate-100 text-slate-500 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Item</th>
                                <th className="px-4 py-3 text-left">Qty</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-right">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoiceDetail?.items?.map((inv) => (
                                <tr key={inv._id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        {inv.name}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {inv.quantity}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        ₹ {formatAmount(inv.price)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                                        ₹ {formatAmount(inv.subtotal)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                {/* TOTAL SECTION */}
                <div className="mt-8 flex justify-end">
                    <div className="w-full max-w-xs space-y-2 text-sm">

                        <div className="flex justify-between text-slate-500">
                            <span>Subtotal</span>
                            <span>₹ {formatAmount(invoiceDetail?.subTotal)}</span>
                        </div>

                        <div className="flex justify-between text-slate-500">
                            <span>Tax ({invoiceDetail?.taxPercent}%)</span>
                            <span>
                                ₹ {formatAmount(invoiceDetail?.taxAmount)}
                            </span>
                        </div>

                        <div className="flex justify-between text-lg font-bold text-slate-800 border-t pt-2">
                            <span>Total</span>
                            <span>₹ {formatAmount(invoiceDetail?.totalAmount)}</span>
                        </div>

                    </div>
                </div>

                {/* NOTE */}
                {invoiceDetail?.notes && (
                    <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
                        <p className="font-semibold mb-1">Note</p>
                        <p>{invoiceDetail?.notes}</p>
                    </div>
                )}

                {/* PAYMENT HISTORY */}
                <div className='mt-10 border-t border-slate-200 pt-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <p className='font-semibold text-slate-700'>
                            Payment History
                        </p>
                    </div>

                    {paymentDetail?.length === 0 ? (
                        <p className='text-sm text-slate-400'>No payment recorded</p>
                    ) : (
                        <div className='space-y-3'>
                            {paymentDetail?.map(p => (
                                <div className='flex justify-between border rounded-xl p-3'>
                                    <div>
                                        <p className='font-semibold text-slate-800'>
                                            ₹ {formatAmount(p.amount)}
                                        </p>
                                        <p className='text-xs text-slate-500'>
                                            {p.method} • {formatDate(p.createdAt)}
                                        </p>
                                    </div>

                                    <div className='text-right'>
                                        <p className='text-xs text-slate-400'>
                                            {p.paidBy?.firstName} {p.paidBy?.lastName}
                                        </p>
                                        <p className='text-xs text-slate-400'>
                                            TXN: {p.gatewayPaymentId || "-"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ACTIVITY TIMELINE */}
                {logs?.length > 0 && (
                    <div className='mt-10 border-t border-slate-200 pt-6'>
                        <p className='font-semibold text-slate-700 mb-4'>
                            Activity Timeline
                        </p>

                        <div className='space-y-4'>
                            {logs.map((log, index) => (
                                <div key={index} className="flex items-start gap-3">

                                    {/* DOT */}
                                    <div className="mt-1 w-3 h-3 rounded-full bg-blue-500"></div>

                                    {/* CONTENT */}
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {log.action}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {log.user.firstName}  {log.user.lastName} ({log.role})
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {new Date(log.time).toLocaleString()}
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </div>
    )
}

export default InvoiceDetail