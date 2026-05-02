import React, { useState } from 'react'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { Lock, LogIn, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { sendOtp } from '../services/userService'

const ForgetPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const handleSendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try{
            const {data} = await sendOtp(email)
            toast.success("Otp send successfully")
            setStep(2)
        }
        catch(err) {
            toast.error(err.response?.data?.message || "Server Error")
        }
        finally{
            setLoading(false)
        }
    }
    const handleResetPassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        try{
            const {data} = await resetPassword(email, otp, password)
            toast.success(data.message || "Password reset successfully")
        }
        catch(err) {
            toast.error(err.response?.data?.message || "Server Error")
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

            <div className="w-full max-w-md space-y-6">

                {/* BRAND */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        Reset Password
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Enter your email to receive OTP verification
                    </p>
                </div>

                {/* CARD */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                    <form
                        onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
                        className="space-y-4"
                    >

                        <Input
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {step === 2 && (
                            <>
                                <Input
                                    label="OTP Code"
                                    icon={Mail}
                                    type="number"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />

                                <Input
                                    label="New Password"
                                    icon={Lock}
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            children={
                                loading
                                    ? "Processing..."
                                    : step === 1
                                        ? "Send OTP"
                                        : "Reset Password"
                            }
                            variant="primary"
                        />

                    </form>

                </div>

                {/* FOOTER LINK */}
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

export default ForgetPassword