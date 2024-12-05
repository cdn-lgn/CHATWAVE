import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import upload from '../config/multer.js';
import { createGroup } from '../controllers/groupController.js';

const router = express.Router()

router.post('/createGroup',authMiddleware,upload.single("profileImage"),createGroup)
// router.post('/searchUsers',authMiddleware,logOut)

export default router
