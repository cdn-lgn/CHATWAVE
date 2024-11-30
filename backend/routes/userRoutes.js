import express from "express"
import { login, signUp } from "../controllers/userController.js"
import upload from "../config/multer.js"

const router = express.Router()

router.post("/signup",upload.single("profileImage"),signUp)
router.post('/login',login)

export default router