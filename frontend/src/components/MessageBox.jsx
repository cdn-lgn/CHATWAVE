import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck,faClock } from "@fortawesome/free-solid-svg-icons";

const MessageBox = ({ receiver, message, theme, waite }) => {
  const user = useSelector((state) => state.user.user);
  const isUser = message?.sender?._id == user._id;

  return (
    <div
      className={`flex items-start mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <img
          src={!message?.isGroupMessage && receiver?.participant?.profileImage}
          alt="Friend Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}
      <div
        style={{
          backgroundColor: isUser ? theme.button : theme.secondary,
          color: isUser ? "#FFFFFF" : theme.text,
        }}
        className={`relative p-3 rounded-lg max-w-xs flex items-center justify-center gap-2 ${isUser ? "ml-auto" : "mr-auto"}`}
      >
        {/* Message content wrapped in p tag for better styling */}
        <p className="break-words w-full">{message?.content?.message}</p>
        {isUser && (<div className="">
        <FontAwesomeIcon icon={waite ? faClock : faCheck} className="absolute text-[12px] bottom-1 right-1" />
        </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
