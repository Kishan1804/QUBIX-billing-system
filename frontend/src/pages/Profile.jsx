import React, { useEffect, useState } from 'react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { CircleUser, Mail, Phone, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from '../components/common/LoadingScreen'
import { updateUser } from '../services/userService'
import toast from 'react-hot-toast'

const Profile = () => {
    const { user, refreshUser } = useAuth()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [number, setNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        setLoading(true)
        try {
            setFirstName(user?.firstName)
            setLastName(user?.lastName)
            setNumber(user?.phone)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const { data } = await updateUser(user._id, { firstName, lastName, phone: number })

            await refreshUser()

            toast.success(data.message)
        } catch (err) {
            toast.error(err.response?.data?.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <LoadingScreen text='Fetching user profile...' />

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                    Settings
                </h1>
                <p className="text-slate-400">
                    Manage your account information & profile
                </p>
            </div>

            {/* PROFILE CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* LEFT PROFILE */}
                    <div className="flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">

                        <img
                            className="h-28 w-28 rounded-2xl object-cover shadow-sm border border-slate-200"
                            src="https://www.bing.com/th/id/OIP.7O4_GREtLbxqPdJCTmfatQHaHa?w=186&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.4&pid=3.1&rm=2"
                            alt="User Avatar"
                        />

                        <h3 className="mt-4 text-lg font-semibold text-slate-800">
                            {firstName} {lastName}
                        </h3>

                        <p className="text-sm text-slate-400 capitalize">
                            {user?.role}
                        </p>

                        <div className="mt-4 text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                            Account Active
                        </div>

                    </div>

                    {/* RIGHT FORM */}
                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    icon={User}
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />

                                <Input
                                    label="Last Name"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            <Input
                                label="Email"
                                icon={Mail}
                                type="email"
                                value={user?.email}
                                disabled
                            />

                            <Input
                                label="Phone Number"
                                icon={Phone}
                                type="number"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                            />

                            <Input
                                label="Account Type"
                                icon={CircleUser}
                                type="text"
                                value={user?.role}
                                disabled
                            />

                            <div className="pt-2">
                                <Button
                                    children={submitting ? "Saving..." : "Save changes"}
                                    variant="primary"
                                />
                            </div>

                        </form>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Profile