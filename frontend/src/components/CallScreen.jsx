import React, { useContext, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPhoneAlt,
    faPhoneSlash,
    faVolumeUp,
    faMicrophone,
    faPhone
} from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../context/socketContext";
import { userContext } from '../context/userContext';

const CallScreen = () => {
    const {theme} =useContext(userContext)
    const { callStatus, answerCallHandler, myVideoRef, callerVideoRef,onCallUser ,callEndHandler,socket} =
        useContext(SocketContext);

    const handleAnswer = async () => {
        answerCallHandler();
    };

    const handleEndCall = () => {
        callEndHandler();
        socket.current.emit("end-call",{receiverID:onCallUser._id})
    };



    if (callStatus === "sending-call") {
        return (
            <div className="fixed w-full h-full bg-black rounded-xl z-20 text-black transition-all duration-300">
            <div className="m-2 absolute w-20 flex items-center justify-center flex-col">
                <img className="w-20 h-20 rounded-full object-cover border-2 border-green-600 border" src={onCallUser.profileImage} alt="avatar"/>
                <h2 className="font-bold">{onCallUser.name}</h2>
            </div>
            <div className="absolute bottom-0 p-8 flex items-center justify-around text-3xl w-full">
                {/*<FontAwesomeIcon icon={faVolumeUp} />*/}
                <FontAwesomeIcon className="rotate-[135deg] text-black bg-red-600 hover:bg-red-700 rounded-full p-2 cursor-pointer transition-all duration-300 z-30" icon={faPhone} onClick={handleEndCall} />
            </div>
                <div>
                    <video className="w-screen h-screen object-cover object-center" autoPlay muted ref={myVideoRef} />
                </div>
            </div>
        );
    }
    if (callStatus === "incoming-call") {
        return (
            <div className="fixed w-full h-full bg-black rounded-xl z-20 bottom-0 text-white transition-all duration-300">
             <div className="w-full h-full absolute">
                <img className="object-cover w-screen h-screen opacity-50" src={onCallUser.profileImage} alt="avatar"/>
                <h2 className="absolute w-full text-center text-4xl top-20 font-bold ">{onCallUser.name}</h2>
            </div>
            <div className="absolute bottom-0 p-8 flex items-center justify-around text-3xl w-full">
                <FontAwesomeIcon className="rotate-[135deg] text-black bg-red-600 hover:bg-red-700 rounded-full p-2 cursor-pointer transition-all duration-300" icon={faPhone} onClick={handleEndCall} />
                <FontAwesomeIcon className="rotate-[135deg] text-black bg-green-600 hover:bg-green-700 rounded-full p-2 cursor-pointer transition-all duration-300" icon={faPhone} onClick={handleAnswer} />
            </div>
            </div>
        );
    }
    if (callStatus === "accepted-call") {
        return (
            <div className="fixed w-full h-full bg-black rounded-xl z-20 transition-all duration-300">
                <div className="m-2 absolute w-20 flex items-center justify-center flex-col">
                <img className="w-20 h-20 rounded-full object-cover border-2 border-green-600 border" src={onCallUser.profileImage} alt="avatar"/>
                <h2 className="font-bold">{onCallUser.name}</h2>
            </div>
                <div>
                    <video className="absolute z-30 h-40 w-28 rounded-xl right-0 m-4" ref={myVideoRef} muted autoPlay />
                </div>
                <div>
                    <video className="w-screen h-screen object-cover object-center" autoPlay muted ref={callerVideoRef} />
                </div>

                <div className="absolute bottom-0 p-8 flex items-center justify-around text-3xl w-full">
                    <FontAwesomeIcon
                    className="rotate-[135deg] text-black bg-red-600 hover:bg-red-700 rounded-full p-2 cursor-pointer transition-all duration-300 z-30"
                        icon={faPhone}
                        onClick={handleEndCall}
                    />
                </div>
            </div>
        );
    }

    return null;
};

export default CallScreen;
