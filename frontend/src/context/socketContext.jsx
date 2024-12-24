import React, {
    createContext,
    useEffect,
    useRef,
    useState,
    useContext,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addMessageToChat } from "../redux/messageSlice";
import {
    updateChat,
    updateParticipantStatus,
    updateParticipantTypingStatus,
} from "../redux/chatListSlice";
import { Peer } from "peerjs";

const backendUrl = import.meta.env.VITE_SOCKET_API

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const [peerId, setPeerId] = useState("");
    const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    const peerInstance = useRef(null);
    const [callStatus, setCallStatus] = useState(""); // Track call status
    const [onCallUser, setOnCallUser] = useState(null); // Track user being called

    // Setup socket connection and event listeners
    useEffect(() => {
        if (user) {
            socket.current = io(`${backendUrl}`, {
                transports: ["websocket"],
                withCredentials: true,
            });

            socket.current.on("connect", () => {
                console.log("Socket connected with ID:", socket.current.id);
            });

            socket.current.on("user_status_change", ({ userID, status }) => {
                dispatch(updateParticipantStatus({ userID, status }));
            });

            socket.current.on("user_typing_status", (data) => {
                dispatch(updateParticipantTypingStatus(data));
            });

            socket.current.on(
                "receive_group_message",
                ({ updatedChat, newMessage }) => {
                    // console.log(updatedChat)
                    dispatch(addMessageToChat(newMessage));
                    dispatch(updateChat(updatedChat));
                },
            );
            socket.current.on(
                "receive_message",
                ({ updatedChat, newMessage }) => {
                    // console.log(updatedChat)
                    dispatch(addMessageToChat(newMessage));
                    dispatch(updateChat(updatedChat));
                },
            );
            socket.current.on("add_chat",({createdChat})=>{
                console.log(createdChat)
                dispatch(updateChat(createdChat))
            })

            // socket.current.on("message_delivered", (data) => console.log("delivered"));
            socket.current.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
                // alert("Socket connection error. Please try again.");
            });

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                    console.log("Socket disconnected");
                }
            };
        }
    }, [user, dispatch]);

    const sendCall = (remotePeerId) => {
        var getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (mediaStream) => {
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();

            const call = peerInstance.current.call(remotePeerId, mediaStream);

            call.on("stream", (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
            });
        });
    };
    useEffect(() => {
        const peer = new Peer(user._id);

        peer.on("open", (id) => {
            setPeerId(id);
        });

        peer.on("call", (call) => {
            var getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;

            getUserMedia({ video: true, audio: true }, (mediaStream) => {
                currentUserVideoRef.current.srcObject = mediaStream;
                currentUserVideoRef.current.play();
                call.answer(mediaStream);
                call.on("stream", function (remoteStream) {
                    remoteVideoRef.current.srcObject = remoteStream;
                    remoteVideoRef.current.play();
                });
            });
        });
        peerInstance.current = peer;
    }, []);

    return (
        <SocketContext.Provider
            value={{
                socket,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
