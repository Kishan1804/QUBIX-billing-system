import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { sendMail } from "../utils/mail/sendMail.js";
import { resetOtpTemplate } from "../utils/mail/templates.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: true })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, password, role } = req.body

    if (
        [firstName, lastName, email, phone, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "Email already exists")
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        role
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(400, "No refresh token provided")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (err) {
        throw new ApiError(401, err?.message || "Something went wrong")
    }
})

const getUserList = asyncHandler(async (req, res) => {
    const users = await User.find({ isActive: true }).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "User list fetched successfully"
        )
    )
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (id === req.user._id.toString()) {
        throw new ApiError(403, "Can't delete your own account")
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "User deleted successfully"
        )
    )
})

const updateUser = asyncHandler(async (req, res) => {
    const { editId } = req.params
    const { firstName, lastName, email, number, role } = req.body

    const user = await User.findById(editId).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (firstName !== undefined) user.firstName = firstName
    if (lastName !== undefined) user.lastName = lastName
    if (email !== undefined) user.email = email
    if (number !== undefined) user.number = number
    if (role !== undefined) user.role = role

    await user.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User updated successfully"
        )
    )
})

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User profile fetched successfully"
        )
    )
})

const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (user.otpExpire && user.otpExpire > Date.now()) {
        throw new ApiError(429, "OTP already sent. Try again later")
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    user.resetOtp = otp
    user.otpExpire = Date.now() + 10 * 60 * 1000

    await user.save({ validateBeforeSave: false })

    await sendMail({
        to: email,
        subject: "Password Reset OTP - QUBIX Billing",
        html: resetOtpTemplate(user.firstName, otp)
    })

    return res.status(200).json(
        new ApiResponse(200, {}, "OTP sent successfully")
    )
})

const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body

    if (!email || !otp || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (!user.otpExpire || user.otpExpire < Date.now()) {
        throw new ApiError(400, "OTP Expired")
    }

    if(user.resetOtp !== otp) {
        throw new ApiError(400, "Invalid OTP")
    }

    user.password = password

    user.resetOtp = null
    user.otpExpire = null

    await user.save()

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUserList,
    deleteUser,
    updateUser,
    getUserProfile,
    sendOtp,
    resetPassword
}