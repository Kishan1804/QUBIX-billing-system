import React, { useEffect, useState } from 'react'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useLocation } from 'react-router-dom'
import { Lock, Mail, Phone, User } from 'lucide-react'
import { registerUser, updateUser } from '../services/userService'
import toast from 'react-hot-toast'

const UserCreate = () => {
    const location = useLocation()
    const editUser = location.state

    const [editId, setEditId] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [number, setNumber] = useState("")
    const [role, setRole] = useState("customer")

    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        setSubmitting(true)
        e.preventDefault()
        if (editUser) {
            try {
                const { data } = await updateUser(editId, { firstName, lastName, email, phone: number, role })
                toast.success(data.message)

            } catch (err) {
                toast.error(err.response?.data?.message)
            } finally {
                setSubmitting(false)
            }
        } else {
            try {
                const { data } = await registerUser({ firstName, lastName, email, password, phone: number, role })

                toast.success(data.message)

                setFirstName("")
                setLastName("")
                setEmail("")
                setPassword("")
                setNumber("")
                setRole("customer")
            } catch (err) {
                toast.error(err.response?.data?.message)
            } finally {
                setSubmitting(false)
            }
        }
    }

    useEffect(() => {
        if (editUser) {
            setEditId(editUser._id)
            setFirstName(editUser.firstName)
            setLastName(editUser.lastName)
            setEmail(editUser.email)
            setNumber(editUser.phone)
            setRole(editUser.role)
        }
    }, [])

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                    {editUser ? "Edit User" : "Add User"}
                </h1>
                <p className="text-slate-400">
                    {editUser
                        ? "Update user account details and permissions"
                        : "Create a new user profile in the system"}
                </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            placeholder="Jhon"
                            icon={User}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        <Input
                            label="Last Name"
                            placeholder="Wick"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <Input
                        label="Email Address"
                        icon={Mail}
                        placeholder="you@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {!editUser && (
                        <Input
                            label="Password"
                            icon={Lock}
                            placeholder="...."
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    )}

                    <Input
                        label="Phone Number"
                        icon={Phone}
                        type="number"
                        placeholder="+91 1234567890"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                    />

                    {/* ROLE */}
                    <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">
                            Role
                        </label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700">
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="pt-2">
                        <Button
                            className="w-full"
                            children={submitting ? (editUser ? "Updating..." : "Creating...") : (editUser ? "Update User" : "Add User")}
                            variant="primary" />
                    </div>

                </form>

            </div>

        </div>
    )
}

export default UserCreate