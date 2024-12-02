import React, { useContext } from "react";
import { userContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPhone } from "@fortawesome/free-solid-svg-icons";
import MessageBox from "./MessageBox";
import ImageBox from "./ImageBox";
import VoiceNoteBox from "./VoiceNoteBox";

const ConversationBox = () => {
  const { theme,width } = useContext(userContext); // Get theme context

  // Dummy Messages
  const messages = [
    { id: 1, type: "text", sender: "user", content: "Hi there! How are you?" },
    { id: 2, type: "text", sender: "friend", content: "I'm good, thanks! How about you?" },
    { id: 3, type: "image", sender: "user", content: "https://via.placeholder.com/150" },
    { id: 4, type: "voice", sender: "friend", content: "voice_note_1.mp3" },
    { id: 5, type: "text", sender: "user", content: "Let's catch up soon!" },
  ];

  return (
    <div
      style={{ backgroundColor: theme.background, color: theme.text }}
      className={`flex flex-col h-dvh ${width<=768 ? "min-w-full" :  "w-2/3"}`}
    >
      {/* Conversation Header */}
      <div
        style={{
          backgroundColor: theme.secondary,
          borderBottom: `1px solid ${theme.border}`,
        }}
        className="flex justify-between items-center p-4"
      >
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="Friend Avatar"
            className="w-10 h-10 rounded-full mr-4"
          />
          <div>
            <h4 className="font-bold">Friend Name</h4>
            <p className="text-sm" style={{ color: theme.mutedText }}>
              Online
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="text-xl">
            <FontAwesomeIcon icon={faPhone} />
          </button>
          <button className="text-xl">
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message) => {
          switch (message.type) {
            case "text":
              return <MessageBox key={message.id} message={message} theme={theme} />;
            case "image":
              return <ImageBox key={message.id} message={message} theme={theme} />;
            case "voice":
              return <VoiceNoteBox key={message.id} message={message} theme={theme} />;
            default:
              return null;
          }
        })}
      </div>

      {/* Input Area */}
      <div
        style={{
          backgroundColor: theme.secondary,
          borderTop: `1px solid ${theme.border}`,
        }}
        className="p-4 flex items-center space-x-4"
      >
        <input
          type="text"
          placeholder="Type a message..."
          style={{
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          }}
          className="flex-grow p-3 rounded-lg border"
        />
        <button
          style={{ backgroundColor: theme.button, color: "#FFFFFF" }}
          className="px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ConversationBox;
