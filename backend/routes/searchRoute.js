import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { searchAll } from '../controllers/searchController.js';

const router = express.Router()

router.get('/searchAll',authMiddleware,searchAll)
// router.post('/searchUsers',authMiddleware,logOut)

export default router