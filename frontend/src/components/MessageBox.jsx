import React from "react";
import { useSelector } from "react-redux";

const MessageBox = React.memo(({ message, theme }) => {
  const user = useSelector((state) => state.user.user);
  const isUser  = message?.senderID === user._id;

  console.log("Current User ID:", user._id);
  console.log("Message Sender ID:", message.senderID);

  return (
    <div
      className={`flex items-start mb-4 ${isUser  ? "justify-end" : "justify-start"}`}
    >
      {!isUser  && (
        <img
          src="https://via.placeholder.com/30"
          alt="Friend Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}
      <div
        style={{
          backgroundColor: isUser  ? theme.button : theme.secondary,
          color: isUser  ? "#FFFFFF" : theme.text,
        }}
        className={`p-3 rounded-lg max-w-xs ${isUser  ? "ml-auto" : "mr-auto"}`}
      >
        {message?.content?.message}
      </div>
    </div>
  );
});

export default MessageBox;