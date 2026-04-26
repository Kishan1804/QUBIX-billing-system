import React, { useEffect, useRef, useState } from 'react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Textarea from '../components/common/Textarea'
import { addProducts, deleteProducts, getProducts, updateProducts } from '../services/productService'
import toast from 'react-hot-toast'
import LoadingScreen from '../components/common/LoadingScreen'

const ProductCreate = () => {

    const [edit, setEdit] = useState(false)
    const [productId, setProductId] = useState(null)

    const [productList, setProductList] = useState([])

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [img, setImg] = useState(null)
    const [previewImg, setPreviewImg] = useState("")

    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)

    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)

    const fileInputRef = useRef(null)

    const fetchProduct = async () => {
        try {
            const { data } = await getProducts()
            setProductList(data.data)
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch product")
        }
    }

    const resetForm = () => {
        setEdit(false)
        setProductId(null)
        setName('')
        setDescription('')
        setPrice(0)
        setQuantity(0)
        setImg(null)
        setPreviewImg('')

        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        const formData = new FormData()

        formData.append('name', name)
        formData.append('image', img)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('quantity', quantity)

        try {
            const { data } = await addProducts(formData)

            resetForm()

            toast.success(data.message)

            fetchProduct()
        } catch (err) {
            toast.error(err.response?.data?.message || "Adding failed")
        } finally {
            setSubmitting(false)
        }
    }

    const handleEditProduct = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        const formData = new FormData()

        formData.append("name", name)
        formData.append("description", description)
        formData.append("price", price)
        formData.append("quantity", quantity)

        // only send image if user selected new one
        if (img) {
            formData.append("image", img)
        }

        try {
            const { data } = await updateProducts(productId, formData)

            toast.success(data.message)

            fetchProduct()
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            const { data } = await deleteProducts(id)

            toast.success(data.message)

            fetchProduct()
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Product delete successfully")
        }
    }

    const handleEdit = (item) => {
        setEdit(true)

        setProductId(item._id)
        setName(item.name)
        setImg()
        setDescription(item.description)
        setPreviewImg(item.image)
        setPrice(item.price)
        setQuantity(item.stock)
        fileInputRef.current.value = ""
    }

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true)
            try {
                await Promise.all([
                    fetchProduct(),
                ])
            } finally {
                setLoading(false)
            }
        }

        loadAll()
    }, [])

    if (loading) return <LoadingScreen text='Fetching Product...' />

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                    Manage Products
                </h1>
                <p className="text-slate-400">
                    Create, update and manage inventory items
                </p>
            </div>

            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* PRODUCT FORM */}
                <div className="xl:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Add New Product
                    </h3>

                    <form onSubmit={edit ? handleEditProduct : handleAddProduct} className="space-y-4">

                        <Input
                            label="Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Textarea
                            label="Description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className={`flex flex-col gap-2 ${edit ? "visible" : "hidden"}`}>
                            <div className={`font-medium leading-none`}>Image preview</div>
                            <div className='relative'>
                                <img className="h-10 w-10 rounded-lg object-cover border" src={previewImg} />
                            </div>
                        </div>

                        <Input
                            ref={fileInputRef}
                            label="Product Image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImg(e.target.files[0])}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />

                            <Input
                                label="Stock Qty"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        <Button
                            disabled={submitting}
                            children={submitting ? "Adding..." : edit ? "Edit Product" : "Add Product"}
                            variant="primary"
                        />

                    </form>
                </div>

                {/* PRODUCT TABLE */}
                <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                    <div className="px-6 py-4 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Product Inventory
                        </h3>
                    </div>

                    <div className="overflow-x-auto overflow-y-auto max-h-108">
                        <table className="w-full text-sm">

                            <thead className="bg-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-left">Image</th>
                                    <th className="px-6 py-4 text-left">Name</th>
                                    <th className="px-6 py-4 text-left">Price</th>
                                    <th className="px-6 py-4 text-left">Stock</th>
                                    <th className="px-6 py-4 text-left">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {productList?.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-slate-400">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    productList?.map((item) => (
                                        <tr
                                            key={item._id}
                                            className="border-t border-slate-100 hover:bg-slate-50 transition"
                                        >
                                            <td className="px-6 py-4">
                                                <img
                                                    className="h-10 w-10 rounded-lg object-cover border"
                                                    src={item.image}
                                                />
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-slate-800">
                                                {item.name}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                ₹ {item.price}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full font-medium${item.stock > 10
                                                    ? "bg-green-50 text-green-600"
                                                    : item.stock > 0
                                                        ? "bg-amber-50 text-amber-600"
                                                        : "bg-rose-50 text-rose-600"
                                                    }`}>
                                                    {item.stock}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className='flex items-center gap-3'>
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-blue-500 hover:text-blue-700 font-medium transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="text-rose-500 hover:text-rose-700 font-medium transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default ProductCreate