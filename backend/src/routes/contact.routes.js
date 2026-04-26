import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { createContact, deleteContact, getContacts, markContactRead } from "../controllers/contact.controller.js";

const router = Router()

router.route('/').post(verifyJWT, createContact)

// admin

router.route('/').get(verifyJWT, verifyAdmin, getContacts)

router.route('/:id/read').patch(verifyJWT, verifyAdmin, markContactRead)

router.route('/:id').delete(verifyJWT, verifyAdmin, deleteContact)

export default router