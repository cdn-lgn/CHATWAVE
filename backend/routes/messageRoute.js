import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import upload from '../config/multer.js';
import { fetchChatMessages } from '../controllers/messageController.js';

const router = express.Router()

router.get("/fetchChatMessages/:id",authMiddleware,fetchChatMessages)

export default router
