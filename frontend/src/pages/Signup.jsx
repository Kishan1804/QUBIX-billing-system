import React, { useState } from 'react'
import { CircleUser, Lock, Mail, Phone, User } from 'lucide-react';
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/userService';


const Signup = () => {
    const navigate = useNavigate()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [duPassword, setDuPassword] = useState("")
    const [number, setNumber] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (password != duPassword) {
            toast.error("Password don't match")
            setLoading(false)
            return
        }

        try {
            const { data } = await registerUser({
                firstName, lastName, email, password, phone: number, role: "customer"
            })

            toast.success("Account created successfully")

            navigate('/login')
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

            <div className="w-full max-w-md space-y-6">

                {/* HEADER */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        Create your account
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Start managing invoices and payments today
                    </p>
                </div>

                {/* CARD */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                placeholder="Kishan"
                                icon={User}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />

                            <Input
                                label="Last Name"
                                placeholder="Patel"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <Input
                            label="Email Address"
                            placeholder="you@example.com"
                            icon={Mail}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            placeholder="••••••••"
                            icon={Lock}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="••••••••"
                            icon={Lock}
                            type="password"
                            value={duPassword}
                            onChange={(e) => setDuPassword(e.target.value)}
                            required
                        />

                        <Input
                            label="Phone Number"
                            placeholder="+91 1234567890"
                            icon={Phone}
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            required
                        />

                        <Input
                            label="Account Type"
                            icon={CircleUser}
                            value="Customer"
                            disabled
                        />

                        <Button
                            children={loading ? "Creating..." : "Create Account"}
                            variant="primary"
                            disabled={loading}
                        />

                    </form>

                </div>

                {/* FOOTER */}
                <p className="text-center text-sm text-slate-400">
                    Already have an account?
                    <Link
                        to="/login"
                        className="ml-1 text-blue-600 font-medium hover:text-blue-700"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    )
}

export default Signup