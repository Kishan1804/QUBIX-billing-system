import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },

    image: {
        type: String,
    },

    description: {
        type: String,
    },

    price: {
        type: Number,
        require: true
    },

    stock: {
        type: Number,
        require: true,
        min: 0,
        default: 0
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    })

export const Product = mongoose.model("Product", ProductSchema)