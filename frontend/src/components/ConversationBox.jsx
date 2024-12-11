import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { userContext } from "../context/userContext";
import { SocketContext } from "../context/socketContext";
import useFetchMessagesHook from "../hooks/useFetchMessagesHook";
import MessageBox from "./MessageBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPhone } from "@fortawesome/free-solid-svg-icons";

const ConversationBox = () => {
    const { theme, receiver, width } = useContext(userContext);
    const user = useSelector((state) => state.user.user);

    // Fetch messages safely from Redux
    const messages = useFetchMessagesHook() || []; // Default to an empty array if no messages are found

    const socket = useContext(SocketContext).current;

    const [newMessage, setNewMessage] = useState("");

    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && receiver) {
            const chatID = receiver.chatID;
            const isGroupChat = receiver.entityType === "group";

            if (socket) {
                socket.emit("send_message", {
                    senderID: user._id,
                    chatID: chatID || null,
                    receiverID: receiver?.participantID || receiver._id,
                    groupID: receiver?.groupID || null,
                    content: {
                        type: "text",
                        message: newMessage,
                    },
                    isGroupChat,
                });
            }

            setNewMessage(""); // Clear input after sending
        }
    };

    // Log messages when they change (useEffect to track changes)
    useEffect(() => {
        // console.log(messages);
    }, [messages]); // Run only when messages change

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
                        {/* Render messages only if they exist */}
                        {Array.isArray(messages) && messages.length > 0 ? (
                            messages.map((message, idx) => (
                                <MessageBox key={idx} message={message} theme={theme} />
                            ))
                        ) : (
                            <p>No messages yet.</p>
                        )}
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
                            onChange={(e) => setNewMessage(e.target.value)}
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
