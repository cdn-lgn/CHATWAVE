import React, { useContext, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneAlt, faPhoneSlash, faVolumeUp, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../context/socketContext";

const CallScreen = () => {
    const { callStatus, answerCallHandler,myVideoRef,callerVideoRef } = useContext(SocketContext);

    const handleAnswer = async() => {
        answerCallHandler();
    };

    const handleEndCall = () => {
        // Assuming you have a function to handle the end of the call in your context
        // handleEndCall();
    };

    if (callStatus === "sending-call") {
        return (
            <div className="fixed w-[300px] h-[300px] bg-yellow-300 rounded-xl z-20 bottom-0">
                <FontAwesomeIcon icon={faVolumeUp} />
                <FontAwesomeIcon icon={faPhoneSlash} onClick={handleEndCall} />
                  <div>
        <video autoPlay muted ref={myVideoRef} />
      </div>
            </div>
        );
    }
    if (callStatus === "incoming-call") {
        return (
            <div className="fixed w-[300px] h-[300px] bg-yellow-300 rounded-xl z-20 bottom-0">
                <FontAwesomeIcon icon={faPhoneAlt} onClick={handleAnswer} />
                <FontAwesomeIcon icon={faPhoneSlash} onClick={handleEndCall} />
            </div>
        );
    }
    if (callStatus === "accepted-call") {
        return (
            <div className="fixed w-[300px] h-[300px] bg-yellow-300 rounded-xl z-20 bottom-0 bg-yellow-300">
                <div>
                <h3>myVideo</h3>
        <video ref={myVideoRef} muted autoPlay/>
      </div>
      <div>
      <h3>friendVideo</h3>
        <video ref={callerVideoRef} muted autoPlay/>
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
