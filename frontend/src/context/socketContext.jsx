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
import Peer from "simple-peer";

const backendUrl = import.meta.env.VITE_SOCKET_API;

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const connectionRef = useRef(null);
    const myVideoRef = useRef(null);
    const callerVideoRef = useRef(null);
    const [callStatus, setCallStatus] = useState(""); // Track call status
    const [onCallUser, setOnCallUser] = useState("");
    const [myStream, setMyStream] = useState("");
    const [callerSignal, setCallerSignal] = useState("");

    const startCallHandler = async ({ receiver, sender }) => {
        console.log("starting startCallHandler function");

        try {
            setCallStatus("sending-call");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setMyStream(stream); // Set the stream state
            myVideoRef.current.srcObject = stream;

            const peer = await new Peer({
                initiator: true,
                stream: stream, // Pass the 'stream' directly here
                trickle: false,
            });

            console.log("peer created : ", peer);

            peer.on("signal", (data) => {
                if (socket.current) {
                    socket.current.emit("user-call", {
                        signal: data,
                        receiverID: receiver._id,
                        sender,
                    });
                    setOnCallUser(receiver);
                    setCallStatus("sending-call");
                }
            });

            peer.on("stream", (callerStream) => {
                if (callerVideoRef.current) {
                    callerVideoRef.current.srcObject = callerStream;
                    myVideoRef.current.srcObject = stream;
                }
            });

            socket?.current.once("accepted-call", (data) => {
                console.log("answer yes of call");
                const { signal, senderID } = data;
                setCallStatus("accepted-call");
                peer.signal(signal);
            });

            connectionRef.current = peer;
        } catch (error) {
            console.error(
                "Error getting user media or starting the call:",
                error,
            );
        }
    };

    const answerCallHandler = async () => {
        setCallStatus("accepted-call");
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        setMyStream(stream);

        const peer = new Peer({
            initiator: false,
            stream: stream,
            trickle: false,
        });

        myVideoRef.current.srcObject = stream;

        peer.on("signal", (data) => {
            if (socket?.current) {
                socket.current.emit("answer-call", {
                    signal: data,
                    receiverID: onCallUser._id,
                    senderID: user._id,
                });
                setCallStatus("accepted-call");
            }
        });
        peer.on("stream", (callerStream) => {
            console.log("caller's streams", callerStream);
            callerVideoRef.current.srcObject = callerStream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

const callEndHandler = async () => {
    setCallStatus("");
    setOnCallUser ("");
    if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
    }
    if (myVideoRef.current) {
        myVideoRef.current.srcObject = null;
    }
    if (callerVideoRef.current) {
        callerVideoRef.current.srcObject = null;
    }
    setMyStream("");
    setCallerSignal("");
    if (connectionRef.current) {
        connectionRef.current.destroy();
        connectionRef.current = null;
    }
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream)=>{stream.getTracks().forEach(function(track) {
  track.stop();
});});
};

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
            socket.current.on("add_chat", ({ createdChat }) => {
                console.log(createdChat);
                dispatch(updateChat(createdChat));
            });

            // socket.current.on("message_delivered", (data) => console.log("delivered"));
            socket.current.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
                // alert("Socket connection error. Please try again.");
            });

            // web RTC with Simple Peer
            socket.current.on("user-call", (data) => {
                const { sender, signal } = data;
                setCallStatus("incoming-call");
                setOnCallUser(sender);
                setCallerSignal(signal);
            });
            socket.current.on("end-call",()=>{
                callEndHandler()
            })

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                    console.log("Socket disconnected");
                }
            };
        }
    }, [user, dispatch]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                startCallHandler,
                callStatus,
                setCallStatus,
                answerCallHandler,
                myVideoRef,
                callerVideoRef,
                onCallUser,
                callEndHandler
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
