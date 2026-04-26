import React, { useEffect, useState } from 'react'
import Invoicecard from '../components/cards/Invoicecard'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'
import { downloadInvoicePDF, getInvoices, viewInvoicePDF } from '../services/invoiceService'
import toast from 'react-hot-toast'
import LoadingScreen from '../components/common/LoadingScreen'
import { createPaymentOrder, verifyPayment } from '../services/paymentService'

const Invoices = () => {
    const { role } = useAuth()
    const navigate = useNavigate()

    const [invoiceList, setInvoiceList] = useState([])
    const [loading, setLoading] = useState(false)


    const handleGenerate = () => {
        navigate('/invoices/create')
    }

    const handleInvoiceDetail = (id) => {
        navigate(`/invoices/${id}`)
    }

    const viewPDF = (id) => {
        const API = import.meta.env.VITE_REACT_BASEURL

        window.open(`${API}/api/v1/invoices/view-pdf/${id}`, "_blank")
    }

    const downloadPDF = (id, invNo) => {
        const API = import.meta.env.VITE_REACT_BASEURL
        const link = document.createElement("a")

        link.href = `${API}/api/v1/invoices/download-pdf/${id}`
        link.download = `invoice-${invNo}.pdf`

        document.body.appendChild(link)
        link.click()
        link.remove()
    }

    const handlePayment = async (inv) => {
        try {
            if (inv.status === "paid") {
                toast.error("Invoice already paid")
                return
            }

            const { data } = await createPaymentOrder({
                amount: inv.totalAmount,
                invioceId: inv._id
            })

            const { id: order_id, amount, currency } = data.data

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount,
                currency,
                name: "Advance Billing System",
                description: `Invoice ${inv.invoiceNumber}`,
                order_id,

                handler: async (response) => {
                    try {

                        // 3️⃣ Verify payment
                        const verifyRes = await verifyPayment({
                            response,
                            invoiceId: inv._id
                        })

                        toast.success(verifyRes.data.message)

                        // refresh invoices
                        fetchInvoice()

                    } catch (err) {
                        console.log(err)
                        toast.error(err.response?.data?.message || "Payment verification failed")
                    }
                },

                prefill: {
                    name: `${inv.customer?.firstName} ${inv.customer?.lastName}`,
                    email: inv.customer?.email,
                    contact: inv.customer?.phone
                },

                theme: {
                    color: "#2b8a7e"
                }
            }

            const paymentObject = new window.Razorpay(options)
            paymentObject.open()

        } catch (err) {
            toast.error("Payment initiation failed")
        }
    }

    const fetchInvoice = async () => {
        try {
            const { data } = await getInvoices()

            setInvoiceList(data.data)

        } catch (err) {
            toast.error("Failed to load invoices")
        }
    }

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true)
            try {
                await Promise.all([
                    fetchInvoice(),
                ])
            } finally {
                setLoading(false)
            }
        }

        loadAll()
    }, [])

    if (loading) return <LoadingScreen text='Fetching Invoices...' />

    return (
        <div className='space-y-6'>
            {/* HEADER */}
            <div className='flex items-start justify-between'>
                <div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                        All Invoices
                    </h1>
                    <p className="text-slate-400">
                        Track billing history and payment status
                    </p>
                </div>

                {role === 'admin' && (
                    <Button onClick={handleGenerate} children="+ Generate Invoice" variant="primary" />
                )}
            </div>

            {/* INVOICE SECTION CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                {invoiceList.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        No invoices found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {invoiceList.map(inv => (
                            <Invoicecard
                                key={inv._id}
                                inv={inv}
                                downloadPDF={() => downloadPDF(inv._id, inv.invoiceNumber)}
                                viewPDF={() => viewPDF(inv._id)}
                                handlePayment={() => handlePayment(inv)}
                                handleInvoiceDetail={() => handleInvoiceDetail(inv._id)}
                                payButton={role === 'customer'}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Invoices