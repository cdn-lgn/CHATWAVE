import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { userStatus } from '../controllers/userStatusController.js';

const router = express.Router()

router.get("/:id",authMiddleware,userStatus)

export default router
