import React from "react";

const ChatCard = ({ chat, theme }) => {
  return (
    <div
      className="flex items-center gap-4 w-full rounded-lg cursor-pointer"
      style={{background:theme.secondry}}
    >
      {/* Profile Image */}
      <img
        src={chat.profileImage}
        alt={chat.name}
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Chat Details */}
      <div className="flex-1 min-w-0 relative">
        <div className="flex items-center justify-between">
          <h5 className="font-medium" style={{ color: theme.text }}>
            {chat.name}
          </h5>
          <p className="text-[12px]" style={{ color: theme.mutedText }}>
            {chat.time}
          </p>
        </div>

        <p
          className="text-sm whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ color: theme.text }}
        >
          {chat.lastMessage}
        </p>
      </div>
    </div>
  );
};

export default ChatCard;
