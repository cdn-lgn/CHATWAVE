import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages, resetMessages } from "../redux/messageSlice";
import { userContext } from '../context/userContext';

const fetchMessagesUrl = `${import.meta.env.VITE_USER_API}/message/fetchChatMessages`;

const EMPTY_ARRAY = []

const useFetchMessagesHook = () => {
    const dispatch = useDispatch();
    const { receiver } = useContext(userContext);
    const messages = useSelector((state) => state.messages.messages[receiver?.chatID] || EMPTY_ARRAY);

    const fetchMessages = async () => {
        if (!receiver || !receiver.chatID) return;

        try {
            const chatID = receiver.chatID; // Access _id only if receiver is valid
            const response = await axios.get(`${fetchMessagesUrl}/${chatID}`, { withCredentials: true });
            dispatch(setMessages({ chatID, messages: response.data.messages }));
        } catch (error) {
            console.error("Error fetching messages:", error.message);
        }
    };

    useEffect(() => {
        if (receiver && receiver.chatID) {
            fetchMessages();
        }
        return () => {
            // Optional: If you want to reset messages when receiver changes
            if (receiver && receiver.chatID) {
                dispatch(resetMessages({ chatID: receiver.chatID }));
            }
        };
    }, []);
    return messages; // Return messages
};

export default useFetchMessagesHook;
