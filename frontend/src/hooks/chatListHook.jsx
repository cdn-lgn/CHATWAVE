import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; 
import axios from "axios";

const fetchChatUrl = `${import.meta.env.VITE_USER_API}/chat/fetchALlChats`;

const fetchChatListHook = () => {
    const [fetchedChat, setFetchedChat] = useState([]);
    const user = useSelector(state => state.user.user);

    const fetchChatList = async () => {
        try {
            const response = await axios.get(fetchChatUrl, { withCredentials: true });
            console.log(response.data);
            setFetchedChat(response.data.allChats); // Assuming response.data.allChats contains the chat list
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (user) { // Only fetch if user is available
            fetchChatList();
        }
        return () => {
            setFetchedChat([]); // Clean up if necessary
        };
    }, [user]);
    return fetchedChat; // Return fetched data
};

export default fetchChatListHook;