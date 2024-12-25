import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
	generateAuthenticationOptions,
	verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import User from '../models/userSchema.js'
import TwoFactorAuth from '../models/authSchema.js'


let challengeStore = [];

export const registerChallenge = async (req, res) => {
	try {
		const userId = req.user.id;
		console.log(req.user)

		if (!userId) req.status(404).json({ message: "user not found" });

		const challengePayload = await generateRegistrationOptions({
			rpID: process.env.FRONTEND_URL.split("//")[1] || "localhost:5173",
			rpName: "chatwave",
			userName: "lucky",
			attestationType: 'none',
        timeout: 30_000,
		});
		challengeStore[userId] = challengePayload;

		res.status(200).json({
			message: "success",
			success: true,
			options: challengePayload,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "failed",
			success: false,
		});
	}
};

export const verifyRegistration = async(req,res)=>{
	try {
const userId = req.user.id
		const {challengeResponseForVerification} = req.body
		// console.log(challengeResponseForVerification)
		const response = await verifyRegistrationResponse({
			response:challengeResponseForVerification,
			expectedChallenge:challengeStore[userId].challenge,
			expectedOrigin:process.env.FRONTEND_URL || "http://localhost:5173",
			expectedRPID:process.env.FRONTEND_URL.split("//")[1] || "localhost:5173",
		})
		if(!response) req.status(404).json({ message: "something went wrong" });

		await User.findByIdAndUpdate(userId, { TFA: true})
		await TwoFactorAuth.create({
			user:userId,
			publicKey:response.registrationInfo,
		})
		console.log(response.verified)

	    res.status(200).json({
	      message: "success",
	      success: true,
	      verificationResponse:response.verified
	    });
	} catch (error) {
	    console.log(error);
	    res.status(500).json({
	        message: "failed",
	        success: false,
	    });
	}
}
