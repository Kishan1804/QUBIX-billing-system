import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Productcard from '../components/cards/Productcard'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getProducts } from '../services/productService'
import LoadingScreen from '../components/common/LoadingScreen'

const Products = () => {
    const { role } = useAuth()
    const navigate = useNavigate()

    const [productList, setProductList] = useState([])

    const [loading, setLoading] = useState(false)

    const fetchProduct = async () => {
        try {
            const { data } = await getProducts()
            setProductList(data.data)
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch product")
        }
    }

    const handleCreate = () => {
        navigate('/products/create')
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
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                        All Products
                    </h1>
                    <p className="text-slate-400">
                        Manage your inventory & product catalogue
                    </p>
                </div>

                {role === 'admin' && (
                    <Button onClick={handleCreate} children="+ Add Product" variant="primary" />
                )}
            </div>

            {/* PRODUCT GRID CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                {productList.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        No products available
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productList.map((item) => (
                            <Productcard key={item._id} product={item} />
                        ))}
                    </div>
                )}

            </div>

        </div>
    )
}

export default Products