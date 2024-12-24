import React, { useContext, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneAlt, faPhoneSlash, faVolumeUp, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../context/socketContext";

const CallScreen = () => {
    const { callStatus, handleAnswerCall, currentUserVideoRef,
                remoteVideoRef } = useContext(SocketContext);

    const handleAnswer = async() => {
        handleAnswerCall();
    };

    const handleEndCall = () => {
        // Assuming you have a function to handle the end of the call in your context
        // handleEndCall();
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
            <div className="fixed w-[300px] h-[300px] bg-yellow-300 rounded-xl z-20 bottom-0 bg-yellow-300">
                <div>
        <video ref={currentUserVideoRef} />
      </div>
      <div>
        <video ref={remoteVideoRef} />
      </div>

                <div className="controls">
                    <FontAwesomeIcon icon={faMicrophone} />
                    <FontAwesomeIcon icon={faVolumeUp} />
                    <FontAwesomeIcon icon={faPhoneSlash} onClick={handleEndCall} />
                </div>
            </div>
        );
    }

    return null;
};

export default CallScreen;
