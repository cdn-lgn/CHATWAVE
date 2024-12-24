import React, { createContext, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../constants/theme.js";
import useScreenWidth from "../hooks/widthHook.jsx";

const userContext = createContext();

const WrapperComponentContext = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? JSON.parse(savedTheme) : lightTheme;
    });
    const [middleComponent, setMiddleComponent] = useState("chatList");
    const [rightComponent, setRightComponent] = useState("");
    const [mainViewForMobile, setMainViewForMobile] = useState("menuScreen");
    const [receiver, setReceiver] = useState(null);
    const [groupForEdit, setGroupForEdit] = useState(null);
  const [confirmation,setConfirmation] = useState(true)

    const width = useScreenWidth();

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(theme));
    }, [theme]);

    return (
        <userContext.Provider
            value={{
                theme,
                setTheme,
                width,
                middleComponent,
                setMiddleComponent,
                rightComponent, setRightComponent,
                mainViewForMobile,
                setMainViewForMobile,
                receiver,
                setReceiver,
                groupForEdit, setGroupForEdit,
                confirmation,setConfirmation,
            }}
        >
            {children}
        </userContext.Provider>
    );
};

export { WrapperComponentContext, userContext };
