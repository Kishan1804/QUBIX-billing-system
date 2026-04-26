import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { Lock, LogIn, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginUser } from '../services/userService'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const navigate = useNavigate()

    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await loginUser(email, password)
            login(data.data.user)
            toast.success("Login successful")
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || "Server Error")
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
                        Log in to your account
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Welcome back! Please enter your details
                    </p>
                </div>

                {/* CARD */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <Input
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            label="Password"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex justify-end">
                            <Link
                                to="/login/reset-password"
                                className="text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            children={loading ? "Logging in..." : "Log in"}
                            variant="primary"
                            icon={LogIn}
                        />

                    </form>

                </div>

                {/* FOOTER */}
                <p className="text-center text-sm text-slate-400">
                    Don’t have an account?
                    <Link
                        to="/signup"
                        className="ml-1 text-blue-600 font-medium hover:text-blue-700"
                    >
                        Create one
                    </Link>
                </p>

            </div>

        </div>
    )
}

export default Login