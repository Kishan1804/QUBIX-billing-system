import { Router } from "express";
import { addProduct, deleteProduct, editProduct, getProducts } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/add").post(
    verifyJWT,
    upload.single("image"),
    addProduct
)

router.route("/list").get(verifyJWT, getProducts)

router.route(`/edit/:id`).put(
    verifyJWT,
    upload.single("image"),
    editProduct
)

router.route(`/delete/:id`).delete(verifyJWT, deleteProduct)

export default router