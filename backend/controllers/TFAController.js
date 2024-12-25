import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
	generateAuthenticationOptions,
	verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import User from "../models/userSchema.js";
import TwoFactorAuth from "../models/authSchema.js";

let challengeStore = [];

export const registerChallenge = async (req, res) => {
	try {
		const userId = req.user.id;
		const { name } = req.body;
		console.log(req.user);

		if (!userId) req.status(404).json({ message: "user not found" });

		const challengePayload = await generateRegistrationOptions({
			rpID: process.env.FRONTEND_URL?.split("//")[1] || "localhost",
			rpID: process.env.FRONTEND_URL?.split("//")[1] || "localhost",
			rpName: "chatwave",
			userName: name,
			attestationType: "none",
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

export const verifyRegistration = async (req, res) => {
	try {
		const userId = req.user.id;
		const { challengeResponseForVerification } = req.body;
		// console.log(challengeResponseForVerification)
		const response = await verifyRegistrationResponse({
			response: challengeResponseForVerification,
			expectedChallenge: challengeStore[userId].challenge,
			expectedOrigin: process.env.FRONTEND_URL || "http://localhost:5173",
			expectedRPID:
				process.env.FRONTEND_URL?.split("//")[1] || "localhost",
		});
		if (!response)
			req.status(404).json({ message: "something went wrong" });

		await User.findByIdAndUpdate(userId, { TFA: true });
		await TwoFactorAuth.create({
			user: userId,
			publicKey: response.registrationInfo,
		});
		console.log(response.verified);

		res.status(200).json({
			message: "success",
			success: true,
			verificationResponse: response.verified,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "failed",
			success: false,
		});
	}
};

export const cancelTFA = async (req, res) => {
	try {
		const userId = req.user.id;

		const response = await TwoFactorAuth.deleteOne({ user: userId });
		if (!response)
			req.status(404).json({ message: "something went wrong" });
		await User.findByIdAndUpdate(userId, { TFA: true });

		res.status(200).json({
			message: "success",
			success: true,
			TFAStatus: false,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "failed",
			success: false,
		});
	}
};

export const loginChallege = async (req, res) => {
	try {
		const { userId } = req.body;

		const loginOptions = await generateAuthenticationOptions({
			rpID: process.env.FRONTEND_URL?.split("//")[1] || "localhost",
		});

		challengeStore[userId] = loginOptions.challenge;

		res.status(200).json({
			message: "success",
			success: true,
			options: loginOptions,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "failed",
			success: false,
		});
	}
};

export const loginVerify = async (req, res) => {
	try {
		const { userId, credentials } = req.body;
		const savedCredetials = await TwoFactorAuth.find({ user: userId });
		console.log(credentials)
		if (!savedCredetials)
			req.status(404).json({ message: "something went wrong" });

		const verifiedCredentialsResult = await verifyAuthenticationResponse({
			expectedChallenge: challengeStore[userId],
			expectedOrigin: process.env.FRONTEND_URL || "http://localhost:5173",
			expectedRPID:
				process.env.FRONTEND_URL?.split("//")[1] || "localhost",
			response: credentials,
			authenticator: savedCredetials.publicKey,
		});


console.log(verifiedCredentialsResult.verified)
		res.status(200).json({
			message: "success",
			success: true,
			verificationResponse: verifiedCredentialsResult.verified,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "failed",
			success: false,
		});
	}
};
