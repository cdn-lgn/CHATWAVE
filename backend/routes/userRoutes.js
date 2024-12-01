import express from "express"
import { login, logOut, signUp } from "../controllers/userController.js"
import upload from "../config/multer.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/signup",upload.single("profileImage"),signUp)
router.post('/login',login)
router.post('/logout',authMiddleware,logOut)

export default router