import React, { useEffect, useState } from 'react'
import { getUsers } from '../services/userService'
import toast from 'react-hot-toast'
import Select from '../components/common/Select'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Textarea from '../components/common/Textarea'
import { getProducts } from '../services/productService'
import { createInvoice, generateNumber } from '../services/invoiceService'
import LoadingScreen from '../components/common/LoadingScreen'

const formatAmount = (value) => {
    return Number(value || 0).toLocaleString('en-IN')
}

const InvoiceCreate = () => {

    const [invoiceNumber, setInvoiceNumber] = useState("")

    const [customers, setCustomers] = useState([])
    const [customer, setCustomer] = useState("")
    const [dueDate, setDueDate] = useState("")

    const [productList, setProductList] = useState([])

    const [taxPercent, setTaxPercent] = useState(0)
    const [notes, setNotes] = useState("")

    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [items, setItems] = useState([
        {
            id: Date.now(),
            product: '',
            name: '',
            description: '',
            price: 0,
            quantity: 1,
            subtotal: 0,
        }
    ])

    const handleProductSelect = (index, productId) => {
        const product = productList.find(item => item._id === productId)

        if (!product) return

        const updated = [...items]

        updated[index] = {
            ...updated[index],
            product: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            subtotal: product.price * updated[index].quantity
        }

        setItems(updated)
    }

    const handleQuantityChange = (index, value) => {
        const qty = Number(value)

        const updated = [...items]

        updated[index].quantity = qty
        updated[index].subtotal = updated[index].price * qty

        setItems(updated)
    }

    const addItem = () => {
        setItems([
            ...items,
            {
                id: Date.now(),
                product: '',
                name: '',
                description: '',
                price: 0,
                quantity: 1,
                subtotal: 0,
            }])
    }

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id))
    }

    const subTotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const taxAmount = (subTotal * taxPercent) / 100
    const totalAmount = subTotal + taxAmount

    const generateInvoiceNumber = async () => {
        try {
            const { data } = await generateNumber()
            setInvoiceNumber(data.data)
        } catch (err) {
            toast.error("Failed to generate invoice number")
        }
    }

    const fetchUsers = async () => {
        try {
            const { data } = await getUsers()
            const customerList = data.data.filter((user) => user.role === 'customer')
            setCustomers(customerList)
        } catch (err) {
            toast.error("Failed to load customer")
        }
    }

    const fetchProduct = async () => {
        try {
            const { data } = await getProducts()
            setProductList(data.data)
        } catch (err) {
            toast.error("Failed to load products")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {

            if (!customer) {
                toast.error("Please select a customer")
                setSubmitting(false)
                return
            }

            if (!dueDate) {
                toast.error("Please set a due date")
                setSubmitting(false)
                return
            }

            if (items.length === 0) {
                toast.error("Please add at least one invoice item")
                setSubmitting(false)
                return
            }

            const hasEmptyItems = items.some(item => !item.product)

            if (hasEmptyItems) {
                toast.error("Please select a product for all items")
                setSubmitting(false)
                return
            }

            if (totalAmount <= 0) {
                toast.error("Invoice total must be greater than 0")
                setSubmitting(false)
                return
            }

            const payload = {
                invoiceNumber,
                customerId: customer,
                dueDate,
                items,
                taxPercent,
                subTotal,
                totalAmount,
                taxAmount,
                notes
            }

            const { data } = await createInvoice(payload)
            console.log(data)
            toast.success(data.message)

            generateInvoiceNumber()
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message)
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true)
            try {
                await Promise.all([
                    generateInvoiceNumber(),
                    fetchUsers(),
                    fetchProduct(),
                ])
            } finally {
                setLoading(false)
            }
        }

        loadAll()
    }, [])

    if (loading) return <LoadingScreen text='Fetching data...' />

    return (
        <div className='space-y-6'>

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                    Create Invoice
                </h1>
                <p className="text-slate-400">
                    Invoice No: <span className="font-medium">{invoiceNumber}</span>
                </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* CUSTOMER + DATE */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Select
                            label="Customer"
                            options={customers}
                            valueKey="_id"
                            labelKey="firstName"
                            extraLabelKey="email"
                            onChange={(e) => setCustomer(e.target.value)}
                        />

                        <Input
                            label="Due Date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    {/* ITEMS */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">
                            Invoice Items
                        </h3>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-12 gap-3 items-end bg-slate-50 border border-slate-200 rounded-xl p-3"
                                >
                                    <div className="col-span-4">
                                        <Select
                                            label="Product"
                                            options={productList}
                                            valueKey="_id"
                                            labelKey="name"
                                            value={item.product}
                                            onChange={(e) => handleProductSelect(index, e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Input
                                            disabled={!item.product}
                                            label="Qty"
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Input
                                            label="Price"
                                            readOnly
                                            value={formatAmount(item.price)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Input
                                            label="Total"
                                            readOnly
                                            value={formatAmount(item.subtotal)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Button
                                            type="button"
                                            variant="danger_outline"
                                            children="Remove"
                                            onClick={() => removeItem(item.id)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3">
                            <Button
                                type="button"
                                variant="outline"
                                children="+ Add Item"
                                onClick={addItem}
                            />
                        </div>
                    </div>

                    {/* TAX + NOTES */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                            label="Tax %"
                            type="number"
                            value={taxPercent}
                            onChange={(e) => setTaxPercent(Number(e.target.value))}
                        />

                        <Textarea
                            label="Notes"
                            rows="3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* TOTAL BOX */}
                    <div className="bg-linear-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-4 max-w-sm ml-auto space-y-2 text-sm">
                        <div className="flex justify-between text-slate-500">
                            <span>Subtotal</span>
                            <span>₹ {formatAmount(subTotal)}</span>
                        </div>

                        <div className="flex justify-between text-slate-500">
                            <span>Tax</span>
                            <span>₹ {formatAmount(taxAmount)}</span>
                        </div>

                        <div className="flex justify-between text-lg font-bold text-slate-800 border-t pt-2">
                            <span>Total</span>
                            <span>₹ {formatAmount(totalAmount)}</span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={submitting}
                        children={submitting ? "Creating..." : "Create Invoice"}
                        variant="primary"
                    />

                </form>

            </div>


        </div>
    )
}

export default InvoiceCreate