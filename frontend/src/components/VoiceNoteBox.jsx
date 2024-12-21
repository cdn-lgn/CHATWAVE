import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock } from "@fortawesome/free-solid-svg-icons";

const VoiceNoteBox = ({ message, theme, receiver, waite }) => {
  const user = useSelector((state) => state.user.user);
  const isUser = message?.sender?._id == user._id;

  return (
    <div
      className={`flex items-start mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* If the sender is not the user, display receiver's profile image */}
      {!isUser && (
        <img
          src={!message?.isGroupMessage && receiver?.participant?.profileImage}
          alt="Friend Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      {/* Voice note container */}
      <div className={`relative w-2/3 md:w-1/2 flex items-center justify-center rounded-lg border-2 ${isUser ? "ml-auto" : "mr-auto"}`} style={{borderColor:theme.button}} >
        <div className="audio-container w-full relative ">
          <p
            style={{ color: theme.text }}
            className="whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {message?.content?.name}
          </p>
          <audio
            controls
            className="audio-player"
            controlsList="nodownload noplaybackrate"
          >
            <source src={message?.content?.message} />
            Your browser does not support the audio element.
          </audio>
        </div>
          {isUser && (<div className="">
        <FontAwesomeIcon icon={waite ? faClock : faCheck} className="absolute w-[12px] h-[12px] bottom-1 right-1 rounded-full" style={{backgroundColor:theme.background}}  />
        </div>
        )}
      </div>
    </div>
  );
};

export default VoiceNoteBox;
