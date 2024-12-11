import React, { createContext, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../constants/theme.js";
import useScreenWidth from "../hooks/widthHook.jsx";
import fetchChatListHook from '../hooks/chatListHook';

const userContext = createContext();

const WrapperComponentContext = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? JSON.parse(savedTheme) : lightTheme;
    });
    const [middleComponent, setMiddleComponent] = useState("chatList");
    const [mainViewForMobile, setMainViewForMobile] = useState("menuScreen");
    const [receiver, setReceiver] = useState(null);
    const [chatList, setChatList] = useState([]);
    const width = useScreenWidth();

    // Fetch chat list using the custom hook
    const fetchedChat = fetchChatListHook();

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(theme));
    }, [theme]);

    useEffect(() => {
        setChatList(fetchedChat); // Update chatList whenever fetchedChat changes
    }, [fetchedChat]);

    return (
        <userContext.Provider
            value={{
                theme,
                setTheme,
                width,
                middleComponent,
                setMiddleComponent,
                mainViewForMobile,
                setMainViewForMobile,
                receiver, setReceiver,
                chatList, setChatList,
            }}
        >
            {children}
        </userContext.Provider>
    );
};

export { WrapperComponentContext, userContext };