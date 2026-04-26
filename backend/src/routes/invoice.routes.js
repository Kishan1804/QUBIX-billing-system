import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createInvoice, detailInvoice, downloadInvoicePDF, generateNumber, getInvoices, viewInvoicePDF } from "../controllers/invoice.controller.js";

const router = Router()

router.route('/generate-number').get(verifyJWT, generateNumber)

router.route('/create').post(verifyJWT, createInvoice)

router.route('/list').get(verifyJWT, getInvoices)

router.route('/detail/:id').get(verifyJWT, detailInvoice)

router.route('/view-pdf/:id').get(verifyJWT, viewInvoicePDF)

router.route('/download-pdf/:id').get(verifyJWT, downloadInvoicePDF)

export default router