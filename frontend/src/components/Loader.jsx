import React, { useContext } from "react";
import { userContext } from "../context/userContext";

export const SpinnerLoader = () => {
	const { theme } = useContext(userContext);
	return (
		<div
			className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
			style={{
				borderColor: `${theme.button} transparent transparent transparent`,
			}}
			role="status"
		>
			<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
				Loading...
			</span>
		</div>
	);
};

export const BlinkingLoader = () => {
	const { theme } = useContext(userContext);
	return (
		<div
			className="inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
			style={{ backgroundColor: theme.button }} // Dynamically set bg color
			role="status"
		>
			<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
				Loading...
			</span>
		</div>
	);
};

export const ButtonLoader = () => {
	const { theme } = useContext(userContext);
	return (
		<button
			type="button"
			className="pointer-events-none inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow transition duration-150 ease-in-out focus:outline-none disabled:opacity-70"
			style={{
				backgroundColor: theme.button, // Dynamic button bg color
				boxShadow: `0px 4px 6px ${theme.buttonHover}`, // Optional dynamic shadow
			}}
			disabled
		>
			<div
				className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
				style={{
					borderColor: `${theme.button} transparent transparent transparent`,
				}} // Spinner color
				role="status"
			></div>
			<span>Loading...</span>
		</button>
	);
};
