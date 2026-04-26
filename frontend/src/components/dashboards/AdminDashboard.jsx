import { CircleAlert, CircleCheckBig, DollarSign, FileText, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import Statcard from '../cards/Statcard'
import Button from '../common/Button'
import MinCard from '../cards/MinCard'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingScreen from '../common/LoadingScreen'
import { Chart as ChartJS } from 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import { getUsers } from '../../services/userService'
import { getProducts } from '../../services/productService'
import { getInvoices } from '../../services/invoiceService'

const formatAmount = (value) => Number(value || 0).toLocaleString('en-IN')

const AdminDashboard = () => {

    const [userList, setUserList] = useState([])

    const [productList, setProductList] = useState([])
    const [invoiceList, setInvoiceList] = useState([])
    const [invoiceCount, setInvoiceCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const fetchUser = async () => {
        try {
            const { data } = await getUsers()
            setUserList(data.data)
        } catch (err) {
            toast.error('Failed to load customer')
        }
    }

    const fetchProduct = async () => {
        try {
            const { data } = await getProducts()
            setProductList(data.data)
        } catch (err) {
            toast.error('Failed to load product')
        }
    }

    const fetchInvoice = async () => {
        try {
            const { data } = await getInvoices()
            setInvoiceList(data.data)
        } catch (err) {
            toast.error('Failed to load invoices')
        }
    }

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true)
            try {
                await Promise.all([
                    fetchUser(),
                    fetchProduct(),
                    fetchInvoice(),
                ])
            } finally {
                setLoading(false)
            }
        }

        loadAll()
    }, [])

    const recentInvoices = invoiceList.slice(0, 5)

    const totalRevenue = invoiceList.reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0)

    const paidCount = invoiceList.filter((inv) => inv.status === 'paid').length

    const paidRevenue = invoiceList
        .filter(inv => inv.status === 'paid')
        .reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0)

    const pendingRevenue = invoiceList
        .filter(inv => inv.status === 'pending')
        .reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0)

    const overdueRevenue = invoiceList
        .filter(inv => inv.status === 'overdue')
        .reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0)

    if (loading) return <LoadingScreen text='Fetching Data...' />

    return (
        <>
            <div className="space-y-1 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                    Dashboard
                </h1>
                <p className="text-slate-400">
                    Monitor revenue, invoices and customer activity
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <Statcard title="Total Revenue" value={`₹${formatAmount(totalRevenue)}`} desc={`${invoiceList.length} invoices`} icon={DollarSign} color="text-blue-600" />

                <Statcard title="Total Invoices" value={invoiceList.length} desc="All time" icon={FileText} color="text-green-600" />

                <Statcard title="Total Customers" value={userList.length} desc="All" icon={User} color="text-amber-600" />

                <Statcard title="Paid Invoices" value={paidCount} desc="Paid" icon={CircleCheckBig} color="text-cyan-600" />

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* PRODUCT STOCK */}
                <div className="xl:col-span-1 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div>
                            <div className="text-xl font-semibold text-slate-800">Product Stock</div>
                            <div className="text-sm text-gray-400">Manage your product</div>
                        </div>
                        <Button onClick={() => navigate('/products')} children={"View All"} variant="outline" />
                    </div>
                    <div className="p-6 pt-0 max-h-64 overflow-y-auto">
                        {productList.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">No products found</p>
                        ) : (
                            productList?.map((item) => (
                                <MinCard
                                    key={item._id}
                                    type='product'
                                    name={item.name}
                                    date={item.createdAt}
                                    stock={item.stock} />

                            ))
                        )}
                    </div>
                </div>

                {/* RECENT INVOICE */}
                <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div>
                            <div className="text-xl font-semibold text-slate-800">Recent Invoices</div>
                            <div className="text-sm text-gray-400">Manage your payment & invoices</div>
                        </div>
                        <Button onClick={() => navigate('/invoices')} children={"View All"} variant="outline" />
                    </div>
                    <div className="p-6 pt-0 max-h-96 overflow-y-auto">
                        {recentInvoices.length === 0 ? (
                            <p className="text-center text-gray-400 py-12">No invoices found</p>
                        ) : (
                            recentInvoices.map((inv) => (
                                <MinCard
                                    key={inv._id}
                                    type='invoice'
                                    name={`${inv.customer.firstName} ${inv.customer.lastName}`}
                                    billNo={inv.invoiceNumber}
                                    date={inv.createdAt}
                                    totalAmount={formatAmount(inv.totalAmount)}
                                    icon={CircleAlert}
                                    status={inv.status}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1'>
                <div className='rounded-2xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-white shadow-sm hover:shadow-md transition'>
                    <div className="p-6 items-center">
                        <div className="text-xl font-semibold text-slate-800">Revenue</div>
                    </div>
                    <div className='flex justify-center items-center p-6 pt-0 max-h-112'>
                        <Doughnut
                            data={{
                                labels: ['Paid Revenue', 'Pending Revenue', 'Overdue Revenue'],
                                datasets: [
                                    {
                                        label: "Revenue",
                                        data: [paidRevenue, pendingRevenue, overdueRevenue],
                                        backgroundColor: [
                                            '#22c55e',
                                            '#F59E0B',
                                            '#ef4444'
                                        ],
                                        borderWidth: 1
                                    }
                                ]
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        position: 'top'
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard