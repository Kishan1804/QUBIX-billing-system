import { Contact } from "../models/contact.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMail } from "../utils/mail/sendMail.js"
import { contactConfirmationTemplate } from "../utils/mail/templates.js"

const createContact = asyncHandler(async (req, res) => {

    const { message, fullName, email } = req.body

    if (!message || !fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const contact = await Contact.create({
        customer: req.user._id,
        fullName,
        email,
        message
    })

    await sendMail({
        to: email,
        subject: "Support request received - QUBIX Billing",
        html: contactConfirmationTemplate(fullName, message)
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            contact,
            "Message sent successfully"
        )
    )
})

const getContacts = asyncHandler(async (req, res) => {

    const contacts = await Contact.find()
        .populate("customer", "firstName lastName email")
        .sort({ createdAt: -1 })
        .lean()

    return res.status(200).json(
        new ApiResponse(
            200,
            contacts,
            "Contact messages fetched successfully"
        )
    )
})

const markContactRead = asyncHandler(async (req, res) => {
    const { id } = req.params

    const contact = await Contact.findById(id)

    if (!contact) {
        throw new ApiError(404, "Contact message not found")
    }

    contact.status = "read"
    await contact.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            contact,
            "Message marked as read"
        )
    )
})

const deleteContact = asyncHandler(async (req, res) => {
    const { id } = req.params

    const contact = await Contact.findById(id)

    if (!contact) {
        throw new ApiError(404, "Contact message not found")
    }

    await contact.deleteOne()

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Contact message deleted"
        )
    )
})

export {
    createContact,
    getContacts,
    markContactRead,
    deleteContact,
}