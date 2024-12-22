import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock } from "@fortawesome/free-solid-svg-icons";

const MessageBox = ({ receiver, message, theme, waite }) => {
  const user = useSelector((state) => state.user.user);
  const isUser = message?.sender?._id === user._id;

  return (
    <div
      className={`flex items-start mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <img
          src={message?.isGroupMessage ? message?.sender?.profileImage : receiver?.participant?.profileImage}
          alt="member Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}
      <div
        style={{
          backgroundColor: isUser ? theme.button : theme.secondary,
          color: isUser ? "#FFFFFF" : theme.text,
        }}
        className={`relative py-1 px-2 rounded-lg max-w-xs flex flex-col gap-2 ${isUser ? "ml-auto pb-2" : "mr-auto"}`}
      >
        {/* Show sender's name inside the message bubble for group messages */}
        {!isUser && message.isGroupMessage && (
          <p className="text-sm font-semibold text-gray-500 mb-1">
            {message?.sender?.name}
          </p>
        )}

        {/* Message content */}
        <p className="break-words w-full">{message?.content?.message}</p>

        {/* Show delivery status for the current user */}
        {isUser && (
          <div className="">
            <FontAwesomeIcon
              icon={waite ? faClock : faCheck}
              className="absolute text-[12px] bottom-1 right-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
