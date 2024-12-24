import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "../redux/messageSlice";
import { userContext } from "../context/userContext";

const fetchMessagesUrl = `${import.meta.env.VITE_USER_API}/message/fetchChatMessages`;

const EMPTY_ARRAY = Object.freeze([]);

const useFetchMessagesHook = () => {
    const dispatch = useDispatch();
    const { receiver } = useContext(userContext);
    const messages = useSelector((state) => state.messages.messages[receiver?.chatID] || EMPTY_ARRAY);

    const fetchMessages = async () => {
        if (!receiver || !receiver.chatID || messages.length > 0) return;
        try {
            const chatID = receiver.chatID;
            const response = await axios.get(`${fetchMessagesUrl}/${chatID}`, { withCredentials: true });
            console.log(response.data.allMessages)
            dispatch(setMessages({ messages: response.data.allMessages, chatID }));
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (receiver && receiver.chatID) {
            fetchMessages();
        }
    }, [receiver]);

    return ; // Return cached messages
};

export default useFetchMessagesHook;
