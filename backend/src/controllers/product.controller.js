import { Product } from "../models/product.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, quantity } = req.body

    let imageUrl = ""

    if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path)
        imageUrl = cloudinaryResponse?.secure_url || ""
    }

    const product = await Product.create({
        name,
        description,
        price,
        stock: quantity,
        image: imageUrl,
        createdBy: req.user._id,
        isActive: true
    })

    return res.status(201).json(
        new ApiResponse(200, product, "Product added successfully")
    )
})

const getProducts = asyncHandler(async (req, res) => {

    const productList = await Product.find({ isActive: true })

    return res.status(200).json(
        new ApiResponse(200, productList, "Product list fetched successfully")
    )
})

const editProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, description, price, quantity } = req.body

    if (!name || !description || price === undefined || quantity === undefined) {
        throw new ApiError(400, "All fields are required")
    }

    const product = await Product.findById(id)

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    let imageUrl = product.image

    if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path)

        if (!cloudinaryResponse) {
            throw new ApiError(500, "Image upload failed")
        }

        imageUrl = cloudinaryResponse.secure_url
    }

    // Update fields if provided
    product.name = name
    product.description = description
    product.price = price
    product.stock = quantity
    product.image = imageUrl

    await product.save()

    return res.status(200).json(
        new ApiResponse(200, product, "Product updated successfully")
    )
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Product Delete Successfully")
    )
})

export {
    addProduct,
    getProducts,
    editProduct,
    deleteProduct,
}