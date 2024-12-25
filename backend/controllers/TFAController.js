import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
	generateAuthenticationOptions,
	verifyAuthenticationResponse,
} from "@simplewebauthn/server";

let challengeStore = [];

export const registerChallenge = async (req, res) => {
	try {
		const userId = req.user.id;
		console.log(req.user)

		if (!userId) req.status(404).json({ message: "user not found" });

		const challengePayload = await generateRegistrationOptions({
			rpID: "localhost",
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

export const verifyRegistration = async()=>{
	try {
const userId = req.user.id
		const {challengeResponseForVerification} = req.body
		console.log(challengeResponseForVerification)
		const response = await verifyRegistrationResponse({
			expectedChallenge:challengeStore[userId],
			expectedOrigin:process.env.FRONTEND_URL || "http://localhost:5173",
			expectedRPID:"localhost"
		})
		if(!response) req.status(404).json({ message: "something went wrong" });
	    res.status(200).json({
	      message: "success",
	      success: true,
	      verificationResponse:response
	    });
	} catch (error) {
	    console.log(error);
	    res.status(500).json({
	        message: "failed",
	        success: false,
	    });
	}
}
