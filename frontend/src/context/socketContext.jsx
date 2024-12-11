import React, { createContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
	const socket = useRef(null);
	const user = useSelector((state) => state.user.user);

	useEffect(() => {
		if (user) {
			socket.current = io("http://localhost:3000", {
				transport: ["websocket"],
				withCredentials: true
			});

			socket.current.on("connect", () => {
				console.log("Socket connected:", socket.current.id);
			});

			socket.current.on("receive_message", (message) => {
				// console.log("New message received:", message);
			});

			// Handle any socket error
			socket.current.on("connect_error", (err) => {
				console.error("Socket connection error:", err);
			});
		}

		return () => {
			socket.current.disconnect();
			console.log("Socket disconnected");
		};
	}, [user]);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};
