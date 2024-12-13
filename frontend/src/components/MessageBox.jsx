import React from "react";
import { useSelector } from "react-redux";

const MessageBox = ({ receiver, message, theme }) => {
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
        className={`p-3 rounded-lg max-w-xs ${isUser ? "ml-auto" : "mr-auto"}`}
      >
        {/* Message content wrapped in p tag for better styling */}
        <p className="break-words">{message?.content?.message}</p>
      </div>
    </div>
  );
};

export default MessageBox;
