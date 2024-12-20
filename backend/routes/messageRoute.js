import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import upload from '../config/multer.js';
import { fetchChatMessages,createMessage } from '../controllers/messageController.js';

const router = express.Router()

router.get("/fetchChatMessages/:id",authMiddleware,fetchChatMessages)
router.post("/createMessage",upload.single("file"),authMiddleware,createMessage)

export default router
