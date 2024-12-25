import { startRegistration,startAuthentication } from "@simplewebauthn/browser";
import axios from "axios";

const API_URL = import.meta.env.VITE_USER_API;

export const registerForTFA = async ({ name }) => {
	try {
		const requestCallForChallenge = await axios.post(
			`${API_URL}/TFA/createChallenge-2FA`,
			name,
			{ withCredentials: true },
		);
		console.log(
			"requestCallForChallenge.data.options ",
			requestCallForChallenge.data.options.challenge,
		);
		const { options } = requestCallForChallenge.data;
		const responseForChallenge = await startRegistration({
			optionsJSON: options,
		});
		console.log("response for challenge ", responseForChallenge);

		const responseCallForChallenge = await axios.post(
			`${API_URL}/TFA/verifyChallengeResponse-2FA`,
			{ challengeResponseForVerification: responseForChallenge },
			{ withCredentials: true },
		);

		console.log(responseCallForChallenge.data.verificationResponse);
		return responseCallForChallenge.data.verificationResponse;
	} catch (err) {
		console.error(err);
	}
};

export const cancelationForTFA = async () => {
	try {
		const response = await axios.post(`${API_URL}/TFA/disable-2FA`, null, {
			withCredentials: true,
		});
		return response.data.TFAStatus;
	} catch (error) {
		console.log(error);
	}
};

export const verificationForTFA = async ({ userId }) => {
	try {
		const requestCallForChallenge = await axios.get(
			`${API_URL}/TFA/createLogin-2FA`,
			{ userId },
		);

		const { options } = requestCallForChallenge.data;
		const authenticationResult = await startAuthentication({
			optionsJSON: options,
		});
		console.log("authenticationResult ", authenticationResult);

		const verificationResult = await axios.get(
			`${API_URL}/TFA/verifyLogin-2FA`,
			{ credentials: authenticationResult, userId },
		);

		console.log(verificationResult.data)
		return userId
	} catch (error) {
		console.log(error);
	}
};
