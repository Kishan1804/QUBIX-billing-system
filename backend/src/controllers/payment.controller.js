import crypto from 'crypto'
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import razorpayInstance from "../utils/razorpay.js";
import { ApiError } from '../utils/ApiError.js';
import { Invoice } from '../models/invoice.model.js';
import { Payment } from '../models/payment.model.js';

const createOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100,
        currency: "INR"
    }

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order created"
        )
    )
})

const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body.response;

    const { invoiceId } = req.body

    const sign = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest("hex");

    if (expectedSign !== razorpay_signature) {
        throw new ApiError(400, "Invalid signature")
    }

    const invoice = await Invoice.findById(invoiceId)

    if (!invoice) {
        throw new ApiError(404, "Invoice not found")
    }

    const payment = await Payment.create({
        invoice: invoice._id,
        paidBy: req.user._id,
        amount: invoice.totalAmount,
        method: "online",
        status: "success",

        gatewayPaymentId: razorpay_payment_id,
        gatewayOrderId: razorpay_order_id,
        gatewaySignature: razorpay_signature
    });

    invoice.status = "paid";
    invoice.paidAmount = invoice.totalAmount
    invoice.paymentId = payment._id;

    invoice.activityLogs.push({
        action: `Payment ₹${payment.amount} received via Razorpay`,
        user: req.user._id,
        role: req.user.role
    });

    await invoice.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Payment successful"
        )
    )
})

export {
    createOrder,
    verifyPayment
}