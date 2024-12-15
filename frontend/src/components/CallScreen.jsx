import React, { useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPhoneAlt,
    faPhoneSlash,
    faVolumeUp,
    faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../context/socketContext";

const CallScreen = () => {
    const { callStatus, remoteStream, answerCall, endCall } = useContext(SocketContext);
    const audioRef = useRef(null); // Reference to the audio element

    // Ensure the remote stream is playing
    React.useEffect(() => {
        if (remoteStream && audioRef.current) {
            audioRef.current.srcObject = remoteStream; // Set remote stream as audio source
            audioRef.current.play(); // Start playing the remote stream
        }
    }, [remoteStream]); // This will run when the remoteStream changes

    const handleAnswer = () => {
        answerCall();
    };

    const handleEndCall = () => {
        endCall();
    };

    if (callStatus === "sending") {
        return (
            <div className="fixed w-[300px] h-[300px] bg-yellow-300 rounded-xl z-20 bottom-0">
                <FontAwesomeIcon icon={faVolumeUp} />
                <FontAwesomeIcon icon={faPhoneSlash} onClick={handleEndCall} />
            </div>
        );
    }
    if (callStatus === "incoming") {
        return (
            <div className="fixed w-[300px] h-[300px] bg-yellow-300 rounded-xl z-20 bottom-0">
                <FontAwesomeIcon icon={faPhoneAlt} onClick={handleAnswer} />
                <FontAwesomeIcon icon={faPhoneSlash} onClick={handleEndCall} />
            </div>
        );
    }
    if (callStatus === "connected") {
        return (
            <div className="fixed w-[300px] h-[300px] bg-yellow-300 rounded-xl z-20 bottom-0">
                {/* Show the audio element */}
                <audio ref={audioRef} controls autoPlay>
                    Your browser does not support the audio element.
                </audio>
                <FontAwesomeIcon icon={faMicrophone} />
                <FontAwesomeIcon icon={faVolumeUp} />
                <FontAwesomeIcon icon={faPhoneSlash} onClick={handleEndCall} />
            </div>
        );
    }

    return null;
};

export default CallScreen;
