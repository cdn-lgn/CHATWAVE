import React, { useContext } from "react";
import { userContext } from "../context/userContext";

const CallListBox = () => {
	const { theme, width } = useContext(userContext);

	return (
		<div
			style={{ backgroundColor: theme.background }}
			className={`p-4 h-full relative ${width <= 768 ? "min-w-full" : "w-1/3"}`}
		>
			calllist
		</div>
	);
};

export default CallListBox;
