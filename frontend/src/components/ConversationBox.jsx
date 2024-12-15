import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { userContext } from "../context/userContext";
import useFetchMessagesHook from "../hooks/useFetchMessagesHook";
import MessageBox from "./MessageBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPhone } from "@fortawesome/free-solid-svg-icons";
import { SpinnerLoader } from "./Loader";
import { updateChat } from "../redux/chatListSlice";
import { SocketContext } from "../context/socketContext";

const createChatUrl = `${import.meta.env.VITE_USER_API}/chat/createChat`;

const ConversationBox = () => {
    const {socket, getLocalStream, startCall,callStatus, setCallStatus } = useContext(SocketContext);
    const { theme, receiver, width, setReceiver } = useContext(userContext);
    const user = useSelector((state) => state.user.user);
    const chatUser = useSelector(
        (state) => state.chatList?.chatList[receiver?.chatID],
    );
    const messages = useSelector(
        (state) => state.messages?.messages[receiver?.chatID],
    );
    const dispatch = useDispatch();
    useFetchMessagesHook();


    const [newMessage, setNewMessage] = useState("");
    const typingTimeout = useRef(null);
    const handleTyping = (e) => {
        // e.preventDefault()
        setNewMessage(e.target.value);
        if (receiver?.chatID) {
            socket.emit("user_typing_status", {
                chatID: receiver?.chatID,
                receiverID: receiver?.participant._id,
                status: "typing...",
            });

            clearTimeout(typingTimeout.current);

            typingTimeout.current = setTimeout(() => {
                socket.emit("user_typing_status", {
                    chatID: receiver?.chatID,
                    receiverID: receiver?.participant._id,
                    status: "online",
                });
            }, 500);
        }
    };

    let isRequestPending = false;

    const messageEndRef = useRef(null);

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
            setNewMessage("");
        } catch (error) {
            console.error("Error creating chat:", error);
        } finally {
            isRequestPending = false;
        }
    };

    const requestCallHandler = async () => {
    try {
        // Wait for the local stream to be fetched before starting the call
        await getLocalStream();  // This ensures the stream is ready before calling
        await startCall({
            senderID: user._id,
            receiverID: receiver.participant?._id,
        });
        setCallStatus("sending")
    } catch (error) {
        // Handle the error if the local stream cannot be obtained
        console.error("Error fetching local stream", error);
        alert("Unable to start the call. Please try again later.");
    }
};


    useEffect(() => {
        return () => {
            clearTimeout(typingTimeout.current);
        };
    }, []);
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    useEffect(() => {}, [chatUser]);

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
                                    chatUser
                                        ? chatUser.participant?.profileImage
                                        : receiver?.profileImage
                                }
                                alt="Friend Avatar"
                                className="w-10 h-10 rounded-full mr-4"
                            />
                            <div>
                                <h4 className="font-bold">
                                    {chatUser
                                        ? chatUser?.participant?.name
                                        : receiver?.name}
                                </h4>
                                <p
                                    className="text-sm text-green-700"
                                    // style={{ color: theme.primary }}
                                >
                                    {chatUser && chatUser?.participant?.status}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button className="text-xl">
                                <FontAwesomeIcon
                                    icon={faPhone}
                                    onClick={requestCallHandler}
                                />
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

                        {/* This ref will be used to scroll to the bottom */}
                        <div ref={messageEndRef}></div>
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
                            onChange={(e) => handleTyping(e)}
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
