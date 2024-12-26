import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
	generateAuthenticationOptions,
	verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import TwoFactorAuth from "../models/authSchema.js";
import dotenv from "dotenv"

dotenv.config();
const RegisterChallengeStore = [];
const LoginChallengeStore = [];

function generateSecretKey(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let secretKey = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        secretKey += characters[randomIndex];
    }
    return secretKey;
}
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};



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

		const secretPasskey = generateSecretKey(10)
		const hashedSecretPasskey = await bcrypt.hash(secretPasskey, 10);

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
			secretPasskey:hashedSecretPasskey
		});
		console.log(response.verified);

		res.status(200).json({
			verified: response.verified,
			secretPasskey
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
  
	//   console.log(verifiedCredentialsResult)
if(!verifiedCredentialsResult.verified){
	return res.status(200).json({ message: "authentication Not matched",verified:false,userId });
}


const user = await User.findById(userId)
// console.log(user)

const token = generateToken(userId);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
	console.log(token)

	  res.status(200).json({
		message: "success",
		verified: true,
		user
	  });
	} catch (error) {
	  console.log(error);
	  res.status(500).json({
		message: "Failed to verify credentials",
		success: false,
	  });
	}
  };
  

  export const verifyByKey =async(req,res)=>{
	try {
		const {userId,secretPasskey} = req.body

		const savedCredentials = await TwoFactorAuth.find({ user: userId });

		const isKeyValid = await bcrypt.compare(secretPasskey, savedCredentials.secretPasskey);

		if(!isKeyValid){
			return res.status(200).json({ message: "authentication Not matched",verified:false });
		}

		const token = generateToken(userId);
		res.cookie("token", token, {
		  httpOnly: true,
		  secure: true,
		  sameSite: "strict",
		});
	
		const user = await User.findById(userId)


	  res.status(200).json({
		verified: true,
		user
	  });
	} catch (error) {
		
	  console.log(error);
	  res.status(500).json({
		message: "Failed to verify credentials",
		success: false,
	  });
	}
  }