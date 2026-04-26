import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Invoice } from "../models/invoice.model.js";
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from "url";

const formatCurrency = (num) => `₹${num.toLocaleString("en-IN")}`

const generateNumber = asyncHandler(async (req, res) => {
    const lastInvoice = await Invoice.findOne()
        .sort({ createdAt: -1 })
        .select("invoiceNumber")

    let nextNumber = 1

    if (lastInvoice && lastInvoice.invoiceNumber) {
        const lastNum = parseInt(lastInvoice.invoiceNumber.split("-")[1])
        nextNumber = lastNum + 1
    }

    const invoiceNumber = `INV-${String(nextNumber).padStart(7, "0")}`

    return res.status(200).json(
        new ApiResponse(
            200,
            invoiceNumber,
            "Invoice number generated"
        )
    )
})

const createInvoice = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { invoiceNumber, customerId, dueDate, items, taxPercent, subTotal, totalAmount, taxAmount, notes } = req.body

        if (!items || items.length === 0) {
            throw new ApiError(400, "Invoice must contain at least one item")
        }

        for (const item of items) {

            const product = await Product.findById(item.product).session(session)

            if (!product) {
                throw new ApiError(404, "Product not found")
            }

            if (product.stock < item.quantity) {
                throw new ApiError(404, `Insufficient stock for ${product.name}`)
            }

            product.stock -= item.quantity
            await product.save({ session })
        }

        const invoice = await Invoice.create([{
            invoiceNumber,
            customer: customerId,
            createdBy: req.user._id,
            dueDate,
            items,
            taxPercent,
            subTotal,
            taxAmount,
            totalAmount,
            notes,
            activityLogs: [{
                action: "Invoice Created",
                user: req.user._id,
                role: req.user.role
            }]
        }], { session })

        await session.commitTransaction()
        session.endSession()

        return res.status(201).json(
            new ApiResponse(
                201,
                {},
                "Invoice created successfully"
            )
        )
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }

})

const getInvoices = asyncHandler(async (req, res) => {
    const today = new Date()
    let invoices = []

    await Invoice.updateMany(
        {
            dueDate: { $lt: today },
            status: 'pending' // Don't change paid & overdue invoices
        },
        {
            $set: { status: 'overdue' }
        }
    )

    if (req.user.role === 'admin') {
        invoices = await Invoice.find()
            .populate("customer", "firstName lastName")
            .populate("createdBy", "firstName lastName")
            .sort({ createdAt: -1 })
            .lean()
    }

    else if (req.user.role === 'customer') {
        invoices = await Invoice.find({ customer: req.user._id })
            .populate("customer", "firstName lastName")
            .populate("createdBy", "firstName lastName")
            .sort({ createdAt: -1 })
            .lean()
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            invoices,
            "Invoice list fetched successfully"
        )
    )
})

const detailInvoice = asyncHandler(async (req, res) => {

    const { id } = req.params

    const invoice = await Invoice.findById(id)

    if (!invoice) {
        throw new ApiError(404, "Invoice not found")
    }

    if (req.user.role === 'customer') {
        invoice.activityLogs.push({
            action: "Invoice Viewed",
            user: req.user._id,
            role: req.user.role
        })

        await invoice.save()
    }

    await invoice.populate([
        {
            path: "customer",
            select: "phone firstName lastName email"
        },
        {
            path: "activityLogs.user",
            select: "firstName lastName"
        },
        {
            path: "paymentId",
            select: "amount method status gatewayPaymentId createdAt",
            populate: {
                path: "paidBy",
                select: "firstName lastName"
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            invoice,
            "Invoice detailed fetched successfully"
        )
    )
})

const generateInvoicePDF = (doc, invoice) => {
    // Header
    doc.rect(0, 0, doc.page.width, 15).fill("#2b8a7e")

    doc.moveDown(2)

    doc
        .fillColor("#2b8a7e")
        .fontSize(36)
        .text("Invoice", 400, 40)

    doc
        .fillColor("black")
        .fontSize(12)
        .text("Bill to:", 50, 160)
        .text(`${invoice.customer.firstName} ${invoice.customer.lastName}`)
        .text(invoice.customer.email)
        .text(invoice.customer.phone)

    doc
        .text(`Invoice No: ${invoice.invoiceNumber}`, 350, 160)
        .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`)
        .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`)

    const tableTop = 250

    doc
        .text("Description", 50, tableTop)
        .text("Quantity", 300, tableTop)
        .text("Rate", 380, tableTop)
        .text("Amount", 460, tableTop)

    doc.moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke()

    let position = tableTop + 30

    invoice.items.forEach((item) => {

        const amount = item.quantity * item.price

        doc.text(item.name, 50, position, { width: 230 })

        doc.text(item.quantity, 300, position, {
            width: 50,
            align: "right"
        })

        doc.text(formatCurrency(item.price), 380, position, {
            width: 60,
            align: "right"
        })

        doc.text(formatCurrency(amount), 460, position, {
            width: 80,
            align: "right"
        })

        position += 25
    })

    const totalPosition = position + 40

    doc
        .text("Subtotal", 380, totalPosition)
        .text(formatCurrency(invoice.subTotal), 460, totalPosition)

    doc
        .text("Tax", 380, totalPosition + 20)
        .text(formatCurrency(invoice.taxAmount), 460, totalPosition + 20)

    doc.moveTo(380, totalPosition + 45)
        .lineTo(550, totalPosition + 45)
        .stroke()

    doc
        .fontSize(16)
        .fillColor("#2b8a7e")
        .text("Total", 380, totalPosition + 55)
        .text(formatCurrency(invoice.totalAmount), 460, totalPosition + 55)

}

const viewInvoicePDF = asyncHandler(async (req, res) => {
    const { id } = req.params

    const invoice = await Invoice.findById(id)
        .populate("customer", "firstName lastName email phone")

    if (!invoice) {
        throw new ApiError(404, "Invoice not found")
    }

    if (req.user.role === "customer") {
        invoice.activityLogs.push({
            action: "Invoice PDF Viewed",
            user: req.user._id,
            role: req.user.role
        })

        await invoice.save({ validateBeforeSave: false })
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 })

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const fontPath = path.join(__dirname, "..", "fonts", "Roboto-Regular.ttf")
    doc.font(fontPath)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
        "Content-Disposition",
        `inline; filename=invoice-${invoice.invoiceNumber}.pdf`
    )

    doc.pipe(res)

    generateInvoicePDF(doc, invoice)

    doc.end()
})

const downloadInvoicePDF = asyncHandler(async (req, res) => {
    const { id } = req.params

    const invoice = await Invoice.findById(id)
        .populate("customer", "firstName lastName email phone")

    if (!invoice) {
        throw new ApiError(404, "Invoice not found")
    }

    if (req.user.role === "customer") {
        invoice.activityLogs.push({
            action: "Invoice PDF Downloaded",
            user: req.user._id,
            role: req.user.role
        })

        await invoice.save({ validateBeforeSave: false })
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 })

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const fontPath = path.join(__dirname, "..", "fonts", "Roboto-Regular.ttf")
    doc.font(fontPath)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
    )

    doc.pipe(res)

    generateInvoicePDF(doc, invoice)

    doc.end()
})

export {
    generateNumber,
    createInvoice,
    getInvoices,
    detailInvoice,
    viewInvoicePDF,
    downloadInvoicePDF,
}