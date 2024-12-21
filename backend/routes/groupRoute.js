import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createGroup, addSingleMember, removeSingleMember,getGroupMembers } from "../controllers/groupController.js";
import upload from '../config/multer.js';

const router = express.Router();

router.post('/createGroup', authMiddleware, upload.single("profileImage"), createGroup);
router.post('/addMember', authMiddleware, addSingleMember);
router.get("/members/:groupID", getGroupMembers);
router.post('/removeMember', authMiddleware, removeSingleMember);

export default router;
