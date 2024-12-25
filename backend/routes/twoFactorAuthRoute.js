import express from "express"
import authMiddleware from '../middleware/authMiddleware.js';
import {registerChallenge,verifyRegistration,loginVerify,loginChallege} from '../controllers/TFAController.js'

const router = express.Router()

router.post("/createChallenge-2FA",authMiddleware,registerChallenge)
router.post("/verifyChallengeResponse-2FA",authMiddleware,verifyRegistration)
router.get("/createLogin-2FA",loginChallege)
router.get("/verifyLogin-2FA",loginVerify)

export default router