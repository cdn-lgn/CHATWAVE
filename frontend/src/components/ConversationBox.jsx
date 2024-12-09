import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../context/socketContext";
import { userContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPhone } from "@fortawesome/free-solid-svg-icons";
import MessageBox from "./MessageBox";
import ImageBox from "./ImageBox";
import VoiceNoteBox from "./VoiceNoteBox";

const ConversationBox = () => {
  const { theme, width, receiver } = useContext(userContext); // Get theme context
  const socket = useContext(SocketContext).current;
  const user = useSelector((state) => state.user.user);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (data) => {
        console.log(data);
        setMessages((prevMessages) => [...prevMessages, data]);
      };
      socket.on("receive_message", handleReceiveMessage);
      return () => {
        socket.off("receive_message", handleReceiveMessage);
      };
    }
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() && socket) {
      socket.emit("send_message", {
        senderID: user._id,
        receiverID: receiver._id,
        content: {
          type: "text",
          message: newMessage,
        },
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderID: user._id,
          content: {
            type: "text",
            message: newMessage,
          },
        },
      ]);
      setNewMessage("");
    } else {
      console.log("message is empty or socket NotFound :(");
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.background, color: theme.text }}
      className={`flex flex-col h-dvh ${width <= 768 ? "min-w-full" : "w-2/3"}`}
    >
      {receiver && (
        <>
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
                src={receiver.profileImage}
                alt="Friend Avatar"
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h4 className="font-bold">{receiver.name}</h4>
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
            {messages.map((message, idx) => (
              <MessageBox key={idx} message={message} theme={theme} />
            ))}
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
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)} // Handle message input
              placeholder="Type a message..."
              style={{
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.border,
              }}
              className="flex-grow p-3 rounded-lg border"
            />
            <button
              onClick={sendMessage}
              style={{ backgroundColor: theme.button, color: "#FFFFFF" }}
              className="px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationBox;
