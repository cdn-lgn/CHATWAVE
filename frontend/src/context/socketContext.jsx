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

    const [callStatus, setCallStatus] = useState("");
    // const [localStream, setLocalStream] = useState(null);
    let localStream
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const peerConnectionConfig = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    //******************
    // RTC SETUP START
    //******************
    // Get local media stream (audio/video)
    const getLocalStream = async () => {
     try {
         const stream = await navigator.mediaDevices.getUserMedia({
             audio: true,
             // video: true,  // You can enable video if needed
         });
         if(stream){
             localStream=stream
             console.log(localStream)
         }
     } catch (error) {
         console.error("Error getting local stream:", error);
     }
 };



    // Create peer connection
    const createPeerConnection = ({ receiverID }) => {
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
                    console.log("onicecandidate", event.candidate);
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
    const startCall = async ({ senderID, receiverID }) => {
        console.log(localStream)
        if (!localStream) {
            console.error("Local stream is not available!");
            alert("Local stream is not available.");
            return ;
        }
        const peer = createPeerConnection({ receiverID });

        if (!peer) return;

        // Add local tracks to the peer connection
        localStream.getTracks().forEach((track) => {
            peer.addTrack(track, localStream);
        });

        try {
            // Create an offer
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);

            // Send the offer to the signaling server
            socket.current.emit("offer", { offer, senderID, receiverID });
            console.log("Sending offer:", offer, senderID, receiverID);

            setPeerConnection(peer);
            setCallStatus("callInProgress");
        } catch (error) {
            console.error("Error starting the call:", error);
            alert("Failed to start the call.");
        }
    };

    // Handle incoming offer (answer it)
    const handleIncomingOffer = async ({ offer, senderID, receiverID }) => {
        try {
            const peer = createPeerConnection({ receiverID });
            if (!peer) return;

            await peer.setRemoteDescription(new RTCSessionDescription(offer));

            // Create and send answer
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);

            socket.current.emit("answer", { answer, senderID, receiverID });
            console.log("Sending answer:", answer, senderID, receiverID);

            setPeerConnection(peer);
            setCallStatus("waiting");
        } catch (error) {
            console.error("Error handling incoming offer:", error);
            alert("Error handling the incoming offer.");
        }
    };

    // Handle incoming answer (set remote description)
    const handleIncomingAnswer = ({ answer, senderID, receiverID }) => {
        try {
            const peer = peerConnection;
            if (peer) {
                peer.setRemoteDescription(new RTCSessionDescription(answer));
                console.log("Answer received and set as remote description");
            }

            setCallStatus("connected");
        } catch (error) {
            console.error("Error handling incoming answer:", error);
            alert("Error processing incoming answer.");
        }
    };

    // Handle incoming ICE candidate
    const handleIncomingCandidate = ({ candidate, senderID, receiverID }) => {
        try {
            const peer = peerConnection;
            if (peer) {
                peer.addIceCandidate(new RTCIceCandidate(candidate));
                console.log("ICE candidate added:", candidate);
            }
        } catch (error) {
            console.error("Error adding ICE candidate:", error);
        }
    };
    //******************
    // RTC SETUP END
    //******************

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
                try {
                    dispatch(updateParticipantStatus({ userID, status }));
                } catch (error) {
                    console.error("Error dispatching user status change:", error);
                }
            });

            socket.current.on("user_typing_status", (data) => {
                try {
                    dispatch(updateParticipantTypingStatus(data));
                } catch (error) {
                    console.error("Error dispatching typing status:", error);
                }
            });

            socket.current.on("receive_message", ({ chatObj, messageObj }) => {
                try {
                    dispatch(addMessageToChat(messageObj));
                    dispatch(updateChat(chatObj));
                } catch (error) {
                    console.error("Error dispatching message:", error);
                }
            });

            //************************
            // WebRTC response handlers
            //************************
            socket.current.on(
                "incomingCall",
                ({ offer, senderID, receiverID }) => {
                    console.log("Incoming call:", offer);
                    handleIncomingOffer({ offer, senderID, receiverID });
                    setCallStatus("receiving")
                }
            );

            socket.current.on(
                "callAnswered",
                ({ answer, senderID, receiverID }) => {
                    console.log("Call answered:", answer);
                    handleIncomingAnswer({ answer, senderID, receiverID });
                    setCallStatus("connected")
                }
            );

            socket.current.on(
                "iceCandidate",
                ({ candidate, senderID, receiverID }) => {
                    console.log("Received ICE Candidate:", candidate);
                    handleIncomingCandidate({
                        candidate,
                        senderID,
                        receiverID,
                    });
                }
            );

            socket.current.on("endCall", ({ from }) => {
                console.log("Call disconnected by", from);
                setLocalStream(null);
                setRemoteStream(null); // Clear remote stream if call ends
            });
            //************************
            // WebRTC response end
            //************************

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
        <SocketContext.Provider value={{socket:socket.current,getLocalStream,startCall}}>
            {children}
        </SocketContext.Provider>
    );
};
