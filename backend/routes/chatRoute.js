import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { fetchAllChats,createChat } from '../controllers/chatController.js';

const router = express.Router()

router.get("/fetchAllChats",authMiddleware,fetchAllChats)
router.post("/createChat",authMiddleware,createChat)

export default router
