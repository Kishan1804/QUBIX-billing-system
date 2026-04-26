import mongoose from "mongoose";

const InvoiceItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    subtotal: {
        type: Number,
        required: true
    }
}, { _id: false })

const ActivityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    role: {
        type: String
    },

    time: {
        type: Date,
        default: Date.now
    }

}, { _id: false })

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    dueDate: {
        type: Date,
        required: true
    },

    items: [InvoiceItemSchema],

    taxPercent: {
        type: Number,
        default: 0,
        min: 0
    },

    subTotal: {
        type: Number,
        required: true
    },

    taxAmount: {
        type: Number,
        default: 0
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paidAmount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["paid", "pending", "overdue"],
        default: "pending"
    },

    paymentMethod: {
        type: String,
        enum: ["cash", "bank", "upi", "none"],
        default: "none"
    },

    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        default: null
    },

    notes: {
        type: String
    },

    activityLogs: [ActivityLogSchema]

}, { timestamps: true })

export const Invoice = mongoose.model("Invoice", InvoiceSchema)