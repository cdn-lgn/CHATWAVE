import { startRegistration } from "@simplewebauthn/browser";
import axios from "axios";

const API_URL = import.meta.env.VITE_USER_API;

export const registerForTFA = async () => {
	try {
		const requestCallForChallenge = await axios.post(
			`${API_URL}/TFA/createChallenge-2FA`,null,
			{ withCredentials: true },
		);
		console.log(
			"requestCallForChallenge.data.options ",
			requestCallForChallenge.data.options.challenge,
		);
		const {options} = requestCallForChallenge.data
		const responseForChallenge = await startRegistration({optionsJSON:options});
		console.log("response for challenge ", responseForChallenge);

		const responseCallForCHallenge = await axios.post(
			`${API_URL}/TFA/verifyChallengeResponse-2FA`,
			{ challengeResponseForVerification: responseForChallenge },
			{ withCredentials: true },
		);

		console.log(responseCallForCHallenge.data);
	} catch (err) {
		console.error(err);
	}
};
