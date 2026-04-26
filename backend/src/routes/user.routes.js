import { Router } from "express";
import { deleteUser, getUserList, getUserProfile, loginUser, logoutUser, refreshAccessToken, registerUser, updateUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/refresh-token").post(refreshAccessToken)

// PROTECTED ROUTES
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/profile").get(verifyJWT, getUserProfile)

router.route("/list").get(verifyJWT, getUserList)

router.route("/edit/:editId").put(verifyJWT, updateUser)

router.route("/delete/:id").delete(verifyJWT, deleteUser)

export default router