import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages, resetMessages } from "../redux/messageSlice";

const fetchMessagesUrl = `${import.meta.env.VITE_USER_API}/message/fetchChatMessages`;

const  EMPTY_ARRAY = []

const useFetchMessagesHook = (chatId) => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.messages.messages[chatId] || EMPTY_ARRAY);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${fetchMessagesUrl}/${chatId}`, { withCredentials: true });
            console.log(response.data);

            dispatch(setMessages({ chatId, messages: response.data.messages }));
        } catch (error) {
            console.error("Error fetching messages:", error.message);
        }
    };
    useEffect(() => {
        if (chatId) {
            fetchMessages();
        }
        return () => {
            dispatch(resetMessages({ chatId }));
        };
    }, [chatId]);

    return messages;
};

export default useFetchMessagesHook;
