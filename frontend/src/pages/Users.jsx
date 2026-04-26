import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import { deleteUser, getUsers } from '../services/userService'
import toast from 'react-hot-toast'
import LoadingScreen from '../components/common/LoadingScreen'

const Users = () => {
    const navigate = useNavigate()
    const { role } = useAuth()

    const [userList, setUserList] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchUser = async () => {
        try {
            const { data } = await getUsers()
            setUserList(data.data)
        } catch (err) {
            toast.error("Failed to load users")
        }
    }

    const handleDelete = async (id) => {
        try {
            const { data } = await deleteUser(id)
            toast.success(data.message)
            fetchUser()
        } catch (err) {
            toast.error(err.response?.data?.message)
        }
    }

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true)
            try {
                await Promise.all([
                    fetchUser(),
                ])
            } finally {
                setLoading(false)
            }
        }
        loadAll()
    }, [])

    if (loading) return <LoadingScreen text='Fetching Users...' />

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                        Manage Users
                    </h1>
                    <p className="text-slate-400">
                        View and manage user account details
                    </p>
                </div>

                {role === 'admin' && (
                    <Button
                        onClick={() => navigate('/users/create')}
                        children="+ Add User"
                        variant="primary"
                    />
                )}
            </div>

            {/* TABLE CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">

                        {/* TABLE HEADER */}
                        <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Sr. No</th>
                                <th className="px-6 py-4 text-left">User Name</th>
                                <th className="px-6 py-4 text-left">Email</th>
                                <th className="px-6 py-4 text-left">Role</th>
                                <th className="px-6 py-4 text-left">Action</th>
                            </tr>
                        </thead>

                        {/* TABLE BODY */}
                        <tbody>
                            {userList?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-slate-400">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                userList?.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        className="border-t border-slate-100 hover:bg-slate-50 transition"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 text-slate-800 font-semibold">
                                            {item.firstName} {item.lastName}
                                        </td>

                                        <td className="px-6 py-4 text-slate-500 truncate max-w-55">
                                            {item.email}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 font-medium capitalize">
                                                {item.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">

                                                <Link
                                                    to="/users/create"
                                                    state={item}
                                                    className="text-blue-500 font-medium hover:text-blue-700 transition"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="text-rose-500 hover:text-rose-700 transition"
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
    )
}

export default Users