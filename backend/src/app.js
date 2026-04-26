import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

app.use(express.static("public"))

// ROUTES IMPORT
import userRouter from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import invoiceRoutes from './routes/invoice.routes.js'
import contactRoutes from './routes/contact.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import { errorHandler } from './middlewares/error.middleware.js';


// ROUTES DECLARATION
app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/invoices", invoiceRoutes)
app.use("/api/v1/contact", contactRoutes)
app.use("/api/v1/payments", paymentRoutes)
// app.use("/api/v1/auth", authRoutes)



app.use(errorHandler)
export { app }