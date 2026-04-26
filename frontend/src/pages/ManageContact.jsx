import { Trash, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { deleteContact, getContacts, markContactRead } from '../services/contactService'
import toast from 'react-hot-toast'
import LoadingScreen from '../components/common/LoadingScreen'

const ManageContact = () => {

    const [contacts, setContacts] = useState([])
    const [selectedMessage, setSelectedMessage] = useState(null)

    const [filter, setFilter] = useState("all")

    const [loading, setLoading] = useState(false)

    const fetchContacts = async () => {
        try {
            const { data } = await getContacts()
            setContacts(data.data)
        } catch (err) {
            toast.error("Failed to load messages")
        }
    }

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true)
            try {
                await Promise.all([
                    fetchContacts(),
                ])
            } finally {
                setLoading(false)
            }
        }

        loadAll()
    }, [])

    const markAsRead = async (id) => {
        try {
            await markContactRead(id)

            setContacts(prev => prev.map(msg => msg._id === id ? { ...msg, status: "read" } : msg))
        } catch (err) {
            toast.error("Failed to mark as read")
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteContact(id)

            setContacts(prev => prev.filter(msg => msg._id !== id))

            toast.success("Message deleted")
        } catch (err) {
            toast.error("Failed to delete message")
        }
    }

    const filteredContacts = contacts.filter((msg) => {
        if (filter === "all") return true
        return msg.status === filter
    })

    if (loading) return <LoadingScreen text='Fetching messages...' />

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

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                {contacts.length === 0 ? (
                    <div className='text-center py-16 text-slate-400'>
                        No messages received
                    </div>
                ) : (
                    <>
                        <div className='flex gap-2 mb-3'>
                            {["all", "new", "read"].map(f => (
                                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer ${filter === f ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                            ))}
                        </div>
                        <div className='divide-y'>
                            {filteredContacts.map((msg) => (
                                <div key={msg._id} className='group relative flex justify-between items-start p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition'>

                                    {/* DELETE ICON */}
                                    <button onClick={() => handleDelete(msg._id)} className='absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition bg-white border border-red-200 hover:border-red-400 text-red-500 hover:text-red-700 p-1.5 rounded-full shadow-md'>
                                        <Trash size={16} />
                                    </button>

                                    {/* MESSAGE INFO */}
                                    <div className='flex flex-col gap-1 pr-6 max-w-xl'>

                                        <p className='font-semibold text-slate-800'>
                                            {msg.fullName}
                                        </p>

                                        <p className='text-xs text-slate-500'>
                                            {msg.email}
                                        </p>

                                        <p className='text-sm text-slate-600 mt-2 leading-relaxed'>
                                            {msg.message}
                                        </p>
                                    </div>

                                    {/* STATUS */}
                                    <div className='flex flex-col items-end gap-2'>

                                        <span className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize ${msg.status === "new" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>{msg.status}</span>

                                        <button onClick={() => { if (msg.status === "new") { markAsRead(msg._id) } setSelectedMessage(msg) }} className='text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer'>{msg.status === "new" ? "Read" : "View"}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </div>

            {selectedMessage && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>

                    <div className='relative bg-white w-full max-w-md rounded-2xl shadow-lg p-6'>

                        {/* CLOSE BUTTON */}
                        <button onClick={() => setSelectedMessage(null)} className='absolute right-4 top-4 text-slate-400 hover:text-slate-600'>
                            <X size={16} />
                        </button>

                        {/* HEADER */}
                        <h2 className='text-lg font-semibold text-slate-800 mb-4'>
                            Message Details
                        </h2>

                        {/* NAME */}
                        <div className='mb-3'>
                            <p className='text-xs text-slate-400'>Full Name</p>
                            <p className='font-medium text-slate-800'>{selectedMessage.fullName}</p>
                        </div>

                        {/* E-MAIL */}
                        <div className='mb-3'>
                            <p className='text-xs text-slate-400'>Email</p>
                            <p className='font-medium text-slate-800'>{selectedMessage.email}</p>
                        </div>

                        {/* MESSAGE */}
                        <div className='mb-3'>
                            <p className='text-xs text-slate-400'>Message</p>
                            <p className='text-sm text-slate-600 mt-1 leading-relaxed'>{selectedMessage.message}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ManageContact