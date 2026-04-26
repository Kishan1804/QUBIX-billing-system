import React, { useState } from 'react'
import Input from '../components/common/Input'
import Textarea from '../components/common/Textarea'
import Button from '../components/common/Button'
import { Mail, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { sendContactMessage } from '../services/contactService'

const Contact = () => {

    const [email, setEmail] = useState("")
    const [fullName, setFullName] = useState("")
    const [message, setMessage] = useState("")

    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!fullName || !email || !message) {
            return toast.error("All fields are required")
        }

        try {
            setSubmitting(true)

            const { data } = await sendContactMessage({
                fullName,
                email,
                message
            })

            toast.success(data.message)

            setFullName("")
            setEmail("")
            setMessage("")
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send message")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                    Contact Support
                </h1>
                <p className="text-slate-400">
                    Send us your query or feedback regarding billing system
                </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

                <form onSubmit={handleSubmit} className="space-y-4">

                    <Input
                        label="Full Name"
                        icon={User}
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <Input
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Textarea
                        label="Message"
                        rows="4"
                        placeholder="Write your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={submitting}
                            children={submitting ? "Sending..." : "Send Message"}
                            variant="primary"
                        />
                    </div>

                </form>

            </div>

            {/* SUPPORT INFO CARD (optional but premium feel) */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
                Our support team usually replies within 24 hours.
            </div>

        </div>
    )
}

export default Contact