import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { fetchAllChats,createChat,updateChat } from '../controllers/chatController.js';

const router = express.Router()

router.get("/fetchAllChats",authMiddleware,fetchAllChats)
router.post("/createChat",authMiddleware,createChat)
router.post("/updateChat",authMiddleware,updateChat)

export default router
