import React, { useEffect, useState } from 'react'
import { getInvoices } from '../services/invoiceService'
import toast from 'react-hot-toast'
import LoadingScreen from '../components/common/LoadingScreen'
import { Line } from "react-chartjs-2"

const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN")

const Report = () => {

    const [invoiceList, setInvoiceList] = useState([])
    const [loading, setLoading] = useState(false)

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

    const totalRevenue = invoiceList.reduce(
        (sum, inv) => sum + Number(inv.totalAmount || 0),
        0
    )

    const paidRevenue = invoiceList
        .filter((i) => i.status === "paid")
        .reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0)

    const pendingRevenue = invoiceList
        .filter((i) => i.status !== "paid")
        .reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0)

    const paidCount = invoiceList.filter(i => i.status === "paid").length
    const pendingCount = invoiceList.filter(i => i.status !== "paid").length

    // Chart
    const monthMap = {}

    invoiceList.forEach(inv => {
        const date = new Date(inv.createdAt)
        const key = `${date.getFullYear()}-${date.getMonth()}`

        monthMap[key] =
            (monthMap[key] || 0) + Number(inv.totalAmount || 0)
    })

    const sortedMonths = Object.keys(monthMap).sort()

    const chartData = {
        labels: sortedMonths.map(m => {
            const [y, mo] = m.split("-")
            return new Date(y, mo).toLocaleString("default", { month: "short" })
        }),
        datasets: [
            {
                label: "Revenue",
                data: sortedMonths.map(m => monthMap[m]),
                tension: 0.4,
                fill: true,
                backgroundColor: "rgba(37,99,235,0.1)",
                borderColor: "#2563eb"
            }
        ]
    }

    if (loading) return <LoadingScreen text='Fetching Data...' />

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                    Reports
                </h1>
                <p className="text-slate-400">
                    Billing analytics & revenue insights
                </p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-slate-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                        ₹ {formatAmount(totalRevenue)}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-slate-400">Paid Revenue</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                        ₹ {formatAmount(paidRevenue)}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-slate-400">Pending Revenue</p>
                    <p className="text-2xl font-bold text-rose-500 mt-1">
                        ₹ {formatAmount(pendingRevenue)}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-slate-400">Invoices</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                        {invoiceList.length}
                    </p>
                </div>

            </div>

            {/* CHART */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Monthly Revenue Trend
                </h3>

                <Line data={chartData} />
            </div>

            {/* STATUS SUMMARY */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Invoice Status Summary
                </h3>

                <div className="flex gap-10 text-sm">
                    <div>
                        <p className="text-slate-400">Paid</p>
                        <p className="text-xl font-bold text-emerald-600">
                            {paidCount}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-400">Pending</p>
                        <p className="text-xl font-bold text-rose-500">
                            {pendingCount}
                        </p>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Report