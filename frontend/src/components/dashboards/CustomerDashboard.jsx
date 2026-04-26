import { useEffect, useState } from 'react'
import Statcard from '../cards/Statcard'
import { AlertCircle, CheckCircle, CircleAlert, History, Receipt } from 'lucide-react'
import Button from '../common/Button'
import { useNavigate } from 'react-router-dom'
import MinCard from '../cards/MinCard'
import LoadingScreen from '../common/LoadingScreen'
import toast from 'react-hot-toast'
import { getInvoices } from '../../services/invoiceService'

const formatAmount = (value) => Number(value || 0).toLocaleString('en-IN')

const CustomerDashboard = () => {
  const [invoiceList, setInvoiceList] = useState([])
  const [invoiceCount, setInvoiceCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
          fetchInvoice(),
        ])
      }
      finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  const pendingInvoice = invoiceList.filter((inv) => inv.status !== 'paid')

  const overdueInvoice = invoiceList.filter((inv) => inv.status === 'overdue')

  const paidInvoice = invoiceList.filter((inv) => inv.status === 'paid')

  const pendingAmount = pendingInvoice.reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0)

  const recentInvoices = invoiceList.slice(0, 5)

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
        <Statcard title="My invoices" value={invoiceList.length} desc="Personal Bills" icon={Receipt} color="text-blue-600" />
        <Statcard title="Paid invoices" value={paidInvoice.length} desc="Completed Payments" icon={CheckCircle} color="text-green-600" />
        <Statcard title="Pending amount" value={`₹${formatAmount(pendingAmount)}`} desc="Due Balance" icon={AlertCircle} color="text-amber-600" />
        <Statcard title="Last Invoice" value={`₹${formatAmount(recentInvoices[0]?.totalAmount)}`} desc="Recent Bill" icon={History} color="text-cyan-600" />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* OVERDUE */}
        <div className="xl:col-span-1 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition duration-300">
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              <div className="text-xl font-semibold text-slate-800">Overdue Invoices</div>
              <div className="text-sm text-gray-400">Unpaid invoices past their due date</div>
            </div>
            <Button onClick={() => navigate('/invoices')} children={"View All"} variant="outline" />
          </div>
          <div className="p-6 pt-0 max-h-64 overflow-y-auto">
            {overdueInvoice.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No overdue found</p>
            ) : (
              overdueInvoice.map((inv) => (
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
    </>
  )
}

export default CustomerDashboard