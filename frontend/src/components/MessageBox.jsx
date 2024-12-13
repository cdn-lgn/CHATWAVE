import React from "react";
import { useSelector } from "react-redux";

const MessageBox = (({receiver, message, theme }) => {
  const user = useSelector((state) => state.user.user);
  const isUser  = message?.sender?._id == user._id;
  console.log(user._id)
  console.log(message)
  console.log(user._id==message.sender._id)

  // console.log("Current User ID:", user._id);
  // console.log("Message Sender ID:", message);

  return (
    <div
      className={`flex items-start mb-4 ${isUser  ? "justify-end" : "justify-start"}`}
    >
      {!isUser  && (
        <img
          src={!message?.isGroupMessage && receiver?.participant?.profileImage}
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