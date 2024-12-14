import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
} from "react";
import { SocketContext } from "./socketContext";

const RTCContext = createContext();

export const RTCProvider = ({ children }) => {
    const socket = useContext(SocketContext).current; // Assuming socket is provided in context
    const [callStatus, setCallStatus] = useState("");
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);

    const peerConnectionConfig = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    // Create peer connection
    const createPeerConnection = () => {
        const peer = new RTCPeerConnection(peerConnectionConfig);

        // ICE candidate handler
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", {
                    candidate: event.candidate,
                    senderID,
                    receiverID,
                });
                console.log(
                    "onicecandidate",
                    event.candidate,
                    senderID,
                    receiverID,
                );
            }
        };

        // Track handler (when remote stream is received)
        peer.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
            }
        };

        return peer;
    };

    // Start a call (create offer and send it to the other peer)
    const startCall = async () => {
        if (!localStream) {
            console.error("Local stream is not available!");
            return;
        }
        const peer = createPeerConnection();

        // Add local tracks to the peer connection
        localStream.getTracks().forEach((track) => {
            peer.addTrack(track, localStream);
        });

        // Create an offer
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        // Send the offer to the signaling server
        socket.emit("offer", { offer, senderID, receiverID });
        console.log("Sending offer:", offer, senderID, receiverID);

        setPeerConnection(peer);
        setCallStatus("call;InProgress");
    };

    // Handle incoming offer (answer it)
    const handleIncomingOffer = async ({ offer, senderID, receiverID }) => {
        const peer = createPeerConnection();
        await peer.setRemoteDescription(new RTCSessionDescription(offer));

        // Create and send answer
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.emit("answer", { answer, senderID, receiverID });
        console.log("Sending answer:", answer, senderID, receiverID);

        setPeerConnection(peer);
        setCallStatus("waiting");
    };

    // Handle incoming answer (set remote description)
    const handleIncomingAnswer = ({ answer, senderID, receiverID }) => {
        const peer = peerConnection;
        if (peer) {
            peer.setRemoteDescription(new RTCSessionDescription(answer));
            console.log("Answer received and set as remote description");
        }

        setCallStatus("connected");
    };

    // Handle incoming ICE candidate
    const handleIncomingCandidate = ({ candidate, senderID, receiverID }) => {
        const peer = peerConnection;
        if (peer) {
            peer.addIceCandidate(new RTCIceCandidate(candidate));
            console.log("ICE candidate added:", candidate);
        }
    };

    // Get local media stream (audio/video)
    useEffect(() => {
        const getLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setLocalStream(stream);
            } catch (error) {
                console.error("Error getting local stream:", error);
            }
        };

        getLocalStream();

        // Cleanup function (stop tracks when unmounting)
        return () => {
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [localStream]); // Only run once, or when localStream changes

    return (
        <RTCContext.Provider
            value={{
                callStatus,
                setCallStatus,
                startCall,
                handleIncomingOffer,
                handleIncomingAnswer,
                handleIncomingCandidate,
            }}
        >
            {children}
        </RTCContext.Provider>
    );
};

export const useRTC = () => useContext(RTCContext);
