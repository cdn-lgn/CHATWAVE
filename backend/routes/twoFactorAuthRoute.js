import express from "express"
import authMiddleware from '../middleware/authMiddleware.js';
import {registerChallenge,verifyRegistration} from '../controllers/TFAController.js'

const router = express.Router()

router.post("/createChallenge-2FA",authMiddleware,registerChallenge)
router.post("/verifyChallengeResponse-2FA",authMiddleware,verifyRegistration)

export default router