import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        required: true
    },

    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    method: {
        type: String,
        enum: ["cash", "bank", "upi", "online"],
        required: true
    },

    status: {
        type: String,
        enum: ["success", "failed", "pending"],
        default: "success"
    },

    transactionId: {
        type: String   // bank/upi transaction id
    },

    gatewayPaymentId: {
        type: String   // Razorpay or other gateway payment id
    },

    gatewayOrderId: {
        type: String
    },

    gatewaySignature: {
        type: String
    },

    notes: {
        type: String
    }
}, { timestamps: true });

export const Payment = mongoose.model("Payment", PaymentSchema)