import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { userContext } from "../context/userContext";
import useFetchMessagesHook from "../hooks/useFetchMessagesHook";
import MessageBox from "./MessageBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEllipsisV,
    faPhone,
    faPaperclip
} from "@fortawesome/free-solid-svg-icons";
import { SpinnerLoader } from "./Loader";
import { updateChat } from "../redux/chatListSlice";
import { SocketContext } from "../context/socketContext";
import AttchmentPreview from "./AttchmentPreview";
import { addMessageToChat } from "../redux/messageSlice";
import ImageBox from './ImageBox';
import VoiceNoteBox from './VoiceNoteBox';

const API_URL = import.meta.env.VITE_USER_API;

const ConversationBox = () => {
    const { socket } = useContext(SocketContext);
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
    const [attchment, setAttchment] = useState(null);
    const [dummyMessage, setDummyMessage] = useState();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) {
                alert("attchment maximum size 5MB");
                return;
            }
            setAttchment(file);
        }
    };

    const [newMessage, setNewMessage] = useState("");
    const typingTimeout = useRef(null);
    const handleTyping = (e) => {
        // e.preventDefault()
        setNewMessage(e.target.value);
        if (receiver?.chatID) {
            socket.current.emit("user_typing_status", {
                chatID: receiver?.chatID,
                receiverID: receiver?.participant._id,
                status: "typing...",
            });

            clearTimeout(typingTimeout.current);

            typingTimeout.current = setTimeout(() => {
                socket.current.emit("user_typing_status", {
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
        const content = { type: "text", message: newMessage };
        setDummyMessage({content:content})

        try {
            if (!chatID) {
                const response = await axios.post(
                    `${API_URL}/chat/createChat`,
                    {
                        content,
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
                const updatedLastMessage = await axios.post(
                    `${API_URL}/chat/updateChat`,
                    { chatID, content },
                    { withCredentials: true },
                );
                const message = await axios.post(
                    `${API_URL}/message/createMessage`,
                    {
                        chatID,
                        senderID: user._id,
                        receiverID: receiver?.participant?._id,
                        isGroupMessage: receiver?.isGroupChat,
                        groupID: receiver?.group?._id,
                        content,
                    },
                    { withCredentials: true },
                );
                setDummyMessage("")
                setNewMessage("");

                // console.log(message.data)
                // console.log(updatedLastMessage.data)
                socket.current.emit("send_message", {
                    updatedChat: {
                        lastMessage: updatedLastMessage.data.lastMessage,
                        _id: chatID,
                    },
                    newMessage: message.data.formattedMessage,
                    receiverID: receiver?.participant?._id,
                });
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        } finally {
            isRequestPending = false;
        }
    };

    useEffect(() => {
        return () => {
            clearTimeout(typingTimeout.current);
            setDummyMessage("");
        };
    }, []);
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    useEffect(() => {}, [chatUser]);

    return (
        <div
            style={{ backgroundColor: theme.background, color: theme.text }}
            className={`relative flex flex-col h-dvh ${width <= 768 ? "min-w-full" : "w-2/3"}`}
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
                            <button className="text-xl hidden">
                                <FontAwesomeIcon icon={faPhone} />
                            </button>
                            <button className="text-xl">
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                        </div>
                    </div>

                    {/* Message Area */}
                    <div className="flex-grow p-4 overflow-y-auto transition-all duration-300">
                        {/* Render messages only if they exist */}
                        {
  messages && messages.length > 0 ? (
    messages.map((message, idx) => (
      <React.Fragment key={idx}>
        {message?.content?.type === "text" && (
          <MessageBox
            receiver={receiver}
            message={message}
            theme={theme}
          />
        )}
        {message?.content?.type === "image" && (
          <ImageBox
            receiver={receiver}
            message={message}
            theme={theme}
          />
        )}
        {message?.content?.type === "audio" && (
          <VoiceNoteBox
            receiver={receiver}
            message={message}
            theme={theme}
          />
        )}
      </React.Fragment>
    ))
  ) : receiver?.chatID ? (
    <div className="flex w-full h-full items-center justify-center">
      <SpinnerLoader />
    </div>
  ) : (
    <div className="flex w-full h-full items-center justify-center">
      <p>No message yet</p>
    </div>
  )
}

                        {dummyMessage && dummyMessage?.content?.type=="text" && (
                            <MessageBox
                                message={{sender:{_id:user._id},...dummyMessage}}
                                theme={theme}
                                waite={true}
                            />
                        )}
                        {dummyMessage && dummyMessage?.content?.type=="image" && (<ImageBox
                                    
                                    message={{sender:{_id:user._id},...dummyMessage}}
                                    theme={theme}
                                    waite={true}
                                    />)}
                                {dummyMessage && dummyMessage?.content?.type=="audio" && (<VoiceNoteBox
                                    
                                    message={{sender:{_id:user._id},...dummyMessage}}
                                    theme={theme}
                                    waite={true}
                                    />)}

                        {/* This ref will be used to scroll to the bottom */}
                        <div ref={messageEndRef}></div>
                    </div>

                    {/* Input Area */}
                    {attchment && (
                        <AttchmentPreview
                            attchment={attchment}
                            setAttchment={setAttchment}
                            setDummyMessage={setDummyMessage}
                            dummyMessage={dummyMessage}
                        />
                    )}
                    <div
                        style={{
                            backgroundColor: theme.secondary,
                            borderTop: `1px solid ${theme.border}`,
                        }}
                        className="p-4 flex items-center space-x-4"
                    >
                        {receiver.chatID && (
                            <>
                                <label htmlFor="attachment-input">
                                    <FontAwesomeIcon
                                        icon={faPaperclip}
                                        htmlFor="attachment-input"
                                        name="attchment"
                                        className="h-5 w-5 cursor-pointer rounded-full py-2 px-2"
                                        style={{
                                            backgroundColor: theme.button,
                                            color: "#FFFFFF",
                                        }}
                                    />
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    onClick={(event) => {
                                        event.currentTarget.value = null;
                                    }}
                                    style={{ display: "none" }}
                                    accept="image/*,audio/*,.pdf"
                                    id="attachment-input"
                                />
                            </>
                        )}
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
