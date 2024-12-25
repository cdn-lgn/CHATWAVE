import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
	generateAuthenticationOptions,
	verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import User from "../models/userSchema.js";
import TwoFactorAuth from "../models/authSchema.js";

const RegisterChallengeStore = [];
const LoginChallengeStore = [];

export const registerChallenge = async (req, res) => {
	try {
		const userId = req.user.id;
		const { name } = req.body;
		// console.log(req.body);

		if (!userId) req.status(404).json({ message: "user not found" });

		const challengePayload = await generateRegistrationOptions({
			rpID: process.env.FRONTEND_URL?.split("//")[1] || "localhost",
			rpName: "chatwave",
			userName: name,
			attestationType: "none",
			timeout: 30_000,
		});
		console.log("challengePayLoad",challengePayload)
		RegisterChallengeStore[userId] = challengePayload;

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
			expectedChallenge: RegisterChallengeStore[userId].challenge,
			expectedOrigin: process.env.FRONTEND_URL || "http://localhost:5173",
			expectedRPID:process.env.FRONTEND_URL?.split("//")[1] || "localhost",
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

		const savedCredentials = await TwoFactorAuth.find({ user: userId });

const credentialsObject = [savedCredentials[0].publicKey.credential];

// console.log(credentialsObject[0])
// credentialsObject.map(passkey => {
//     console.log(passkey)
//   })


const loginOptions = await generateAuthenticationOptions({
  rpID: process.env.FRONTEND_URL?.split("//")[1] || "localhost",
  allowCredentials: credentialsObject.map(passkey => ({
    id: passkey.id,
    transports: passkey.transports,
  })),
});


		LoginChallengeStore[userId] = loginOptions;

		// console.log( `LoginChallengeStore[${userId}]`,   LoginChallengeStore[userId])

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
  
	  const savedCredentials = await TwoFactorAuth.find({ user: userId });
  
	  const userCredentials = savedCredentials[0].publicKey;
  
	  const challenge = LoginChallengeStore[userId]?.challenge;
  

	//   console.log(challenge)
	//   console.log(process.env.FRONTEND_URL || "http://localhost:5173")
	//   console.log(process.env.FRONTEND_URL?.split("//")[1] || "localhost")
	//   console.log(credentials)
	//   console.log(userCredentials.credential)


	  const verifiedCredentialsResult = await verifyAuthenticationResponse({
		credential: {
			id: userCredentials.credential.id,
			publicKey: userCredentials.credential.publicKey.buffer,
			counter: userCredentials.credential.counter,
			transports: userCredentials.credential.transports,
		  },
		expectedChallenge: challenge,
		expectedOrigin: process.env.FRONTEND_URL || "http://localhost:5173",
		expectedRPID: process.env.FRONTEND_URL?.split("//")[1] || "localhost",
		response: credentials,
		
	  });
  
console.log(verifiedCredentialsResult)

	  res.status(200).json({
		message: "success",
		success: true,
		verificationResponse: verifiedCredentialsResult.verified,
	  });
	} catch (error) {
	  console.log(error);
	  res.status(500).json({
		message: "Failed to verify credentials",
		success: false,
	  });
	}
  };
  