import React, { createContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addMessageToChat } from '../redux/messageSlice';
import { updateChat } from '../redux/chatListSlice';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            socket.current = io("http://localhost:3000", {
                transports: ["websocket"],
                withCredentials: true,
            });

            socket.current.on("receive_message", ({chatObj, messageObj}) => {
                dispatch(addMessageToChat(messageObj));
                dispatch(updateChat(chatObj));
            });

            socket.current.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
            });

            return () => {
                socket.current.disconnect();
                console.log("Socket disconnected");
            };
        }
    }, [user, dispatch]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
