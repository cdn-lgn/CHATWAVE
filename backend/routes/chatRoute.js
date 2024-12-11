import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { fetchAllChats } from '../controllers/chatController.js';

const router = express.Router()

router.get("/fetchAllChats",authMiddleware,fetchAllChats)

export default router
