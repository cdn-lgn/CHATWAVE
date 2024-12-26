import express from "express"
import authMiddleware from '../middleware/authMiddleware.js';
import {registerChallenge,verifyRegistration,loginVerify,loginChallege, verifyByKey} from '../controllers/TFAController.js'

const router = express.Router()

router.post("/createChallenge-2FA",authMiddleware,registerChallenge)
router.post("/verifyChallengeResponse-2FA",authMiddleware,verifyRegistration)
router.post("/createLogin-2FA",loginChallege)
router.post("/verifyLogin-2FA",loginVerify)
router.post("/verify-passkey-2FA",verifyByKey)

export default router