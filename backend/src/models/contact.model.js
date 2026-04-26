import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["new", "read", "replied"],
            default: "new",
        },
    },
    {
        timestamps: true,
    }
);

export const Contact = mongoose.model("Contact", ContactSchema);