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

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    let localStream = null;
    const [callStatus, setCallStatus] = useState("");
    const [onCallUser, setOnCallUser] = useState(null);
    const [incomingOffer, setIncomingOffer] = useState(null); // New state for incoming offer
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const peerConnectionConfig = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    // Get local media stream (audio/video)
    const getLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                // video: true,  // You can enable video if needed
            });
            if (stream) {
                localStream = stream;
                console.log(localStream);
            }
        } catch (error) {
            console.error("Error getting local stream:", error);
        }
    };

    // Create peer connection
    const createPeerConnection = (receiverID) => {
        try {
            const peer = new RTCPeerConnection(peerConnectionConfig);

            // ICE candidate handler
            peer.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.current.emit("ice-candidate", {
                        candidate: event.candidate,
                        senderID: user?.id,
                        receiverID,
                    });
                    // console.log("onicecandidate", event.candidate);
                }
            };

            // Track handler (when remote stream is received)
            peer.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    setRemoteStream(event.streams[0]);
                }
            };

            return peer;
        } catch (error) {
            console.error("Error creating peer connection:", error);
            alert("Failed to establish peer connection.");
            return null;
        }
    };

    // Start a call (create offer and send it to the other peer)
    const startCall = async ({ sender, receiverID }) => {
        if (!localStream) {
            console.error("Local stream is not available!");
            alert("Local stream is not available.");
            return;
        }
        const peer = createPeerConnection(receiverID);

        if (!peer) return;

        // Add local tracks to the peer connection
        console.log(localStream);
        localStream.getTracks().forEach((track) => {
            peer.addTrack(track, localStream);
        });

        try {
            // Create an offer
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);

            // Send the offer to the signaling server
            socket.current.emit("offer", { offer, sender, receiverID });
            // console.log("Sending offer:", offer, sender,receiverID);

            setPeerConnection(peer);
        } catch (error) {
            console.error("Error starting the call:", error);
            alert("Failed to start the call.");
        }
    };

    // Handle incoming offer (answer it)
    const handleIncomingOffer = async ({ offer, sender, receiverID }) => {
        setIncomingOffer({ offer, sender, receiverID }); // Store the offer for later answering
        setCallStatus("incoming"); // Set call status to "incoming"
    };

    // Answer the incoming call
    const answerCall = async () => {
        if (!incomingOffer) return;

        const { offer } = incomingOffer;
        await getLocalStream();
        if (!localStream) {
            console.error("Local stream is not available!");
            alert("Local stream is not available.");
            return;
        }
        const peer = createPeerConnection(onCallUser._id);
        if (!peer) return;

        await peer.setRemoteDescription(new RTCSessionDescription(offer));

        // Create and send answer
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.current.emit("answer", {
            answer,
            sender: user._id,
            receiverID: onCallUser._id,
        });
        // console.log("Sending answer:", answer, user.name, " to ",onCallUser.name);

        setPeerConnection(peer);
        setCallStatus("connected"); // Set call status to "connected"
    };

    // Handle incoming answer (set remote description)
    const handleIncomingAnswer = ({ answer }) => {
        const peer = peerConnection;
        if (peer) {
            peer.setRemoteDescription(new RTCSessionDescription(answer));
            // console.log("Answer received and set as remote description");
        }
    };

    // Handle incoming ICE candidate
    const handleIncomingCandidate = ({ candidate }) => {
        const peer = peerConnection;
        if (peer) {
            peer.addIceCandidate(new RTCIceCandidate(candidate));
            // console.log("ICE candidate added:", candidate);
        }
    };

    // End the call
    const endCall = () => {
        socket.current.emit("endCall", onCallUser._id);
        setCallStatus("");
        if (localStream) {
            localStream.getTracks().forEach((track) => {
                track.stop(); // Stop each track to release resources
            });
        }
        localStream = null;
        setRemoteStream(null);
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null); // Reset peer connection state
        }
        setOnCallUser(null);
        console.log(localStream)
    };

    useEffect(() => {
        if (user) {
            socket.current = io("https://fluffy-eureka-wrrrq57wj456f9q5-3000.app.github.dev", {
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

            socket.current.on("receive_message", ({ chatObj, messageObj }) => {
                dispatch(addMessageToChat(messageObj));
                dispatch(updateChat(chatObj));
            });

            socket.current.on(
                "incomingCall",
                ({ offer, sender, receiverID }) => {
                    setOnCallUser(sender);
                    handleIncomingOffer({ offer, sender, receiverID });
                },
            );
            socket.current.on(
                "callAnswered",
                ({ answer, sender, receiverID }) => {
                    handleIncomingAnswer({ answer });
                    setCallStatus("connected");
                },
            );
            socket.current.on("iceCandidate", handleIncomingCandidate);
            socket.current.on("endCall", () => {
                setCallStatus(""); // Reset call status
                localStream = null;
                setRemoteStream(null); // Clear remote stream if call ends
            });

            socket.current.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
                alert("Socket connection error. Please try again.");
            });
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
                console.log("Socket disconnected");
            }
        };
    }, [user, dispatch]);

    return (
        <SocketContext.Provider
            value={{
                socket: socket.current,
                getLocalStream,
                startCall,
                callStatus,
                setCallStatus,
                onCallUser,
                setOnCallUser,
                answerCall,
                endCall,
                remoteStream,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
