import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setChatList } from "../redux/chatListSlice"; 

const fetchChatUrl = `${import.meta.env.VITE_USER_API}/chat/fetchALlChats`;

const useFetchChatList = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const chatList = useSelector(state => state.chatList.chatList);

    const fetchChatList = async () => {
        try {
            const response = await axios.get(fetchChatUrl, { withCredentials: true });
            console.log(response.data);
            dispatch(setChatList(response.data.allChats));
        } catch (error) {
            console.log("Error fetching chat list:", error.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchChatList();
        }
        return () => {
        };
    }, [user]);
    return chatList;
};

export default useFetchChatList;
