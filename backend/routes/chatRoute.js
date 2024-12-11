import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { fetchALlChats } from '../controllers/chatController.js';

const router = express.Router()

router.get("/fetchAllChats",authMiddleware,fetchALlChats)

export default router
