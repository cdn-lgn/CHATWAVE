import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { userContext } from "../context/userContext";
import { SocketContext } from "../context/socketContext";
import useFetchMessagesHook from "../hooks/useFetchMessagesHook";
import MessageBox from "./MessageBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPhone } from "@fortawesome/free-solid-svg-icons";
import { SpinnerLoader } from "./Loader";
import { updateChat } from "../redux/chatListSlice";

const createChatUrl = `${import.meta.env.VITE_USER_API}/chat/createChat`;

const ConversationBox = () => {
    const { theme, receiver, width, setReceiver } = useContext(userContext);
    const user = useSelector((state) => state.user.user);
    const messages = useSelector(
        (state) => state.messages?.messages[receiver?.chatID],
    );
    const dispatch = useDispatch();
    useFetchMessagesHook();

    const socket = useContext(SocketContext).current;

    const [newMessage, setNewMessage] = useState("");
    let isRequestPending = false;
    const sendMessage = async (e) => {
        e.preventDefault();

        if (isRequestPending) return;
        isRequestPending = true;

        let chatID = receiver?.chatID;
        let createdChat;

        try {
            if (!chatID) {
                const response = await axios.post(
                    createChatUrl,
                    {
                        content: {
                            type: "text",
                            message: newMessage,
                        },
                        isGroupChat: receiver?.entityType === "group",
                        groupID:
                            receiver?.entityType === "group"
                                ? receiver?._id
                                : null,
                        receiverID:
                            receiver?.entityType === "group"
                                ? null
                                : receiver?._id,
                    },
                    { withCredentials: true },
                );

                createdChat = response.data?.chat;
                chatID = createdChat?.chatID;

                setReceiver(createdChat);
                dispatch(updateChat(createdChat));
            }

            if (chatID) {
                socket.emit("send_message", {
                    senderID: user?._id,
                    content: {
                        type: "text",
                        message: newMessage,
                    },
                    isGroupChat:
                        receiver?.isGroupChat ||
                        receiver.entityType === "group",
                    chatID: chatID,
                    receiverID: receiver?.participant?._id || receiver?._id,
                    groupID: receiver?.group?._id || receiver?._id,
                });
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        } finally {
            isRequestPending = false;
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
                                src={
                                    receiver?.participant?.profileImage ||
                                    receiver?.profileImage
                                }
                                alt="Friend Avatar"
                                className="w-10 h-10 rounded-full mr-4"
                            />
                            <div>
                                <h4 className="font-bold">
                                    {receiver?.participant?.name ||
                                        receiver?.name}
                                </h4>
                                <p
                                    className="text-sm"
                                    style={{ color: theme.mutedText }}
                                >
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
                        {messages && messages.length > 0 ? (
                            messages.map((message, idx) => (
                                <MessageBox
                                    key={idx}
                                    receiver={receiver}
                                    message={message}
                                    theme={theme}
                                />
                            ))
                        ) : receiver?.chatID ? (
                            <div className="flex w-full h-full items-center justify-center">
                                <SpinnerLoader />
                            </div>
                        ) : (
                            <div className="flex w-full h-full items-center justify-center">
                                <p>No message yet</p>
                            </div>
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
                            style={{
                                backgroundColor: theme.button,
                                color: "#FFFFFF",
                            }}
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
