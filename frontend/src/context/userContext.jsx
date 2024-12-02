import { createContext, useEffect, useState } from "react";
import {darkTheme, lightTheme} from '../constants/theme.js'
import useScreenWidth from "../hooks/widthHook.jsx";


const userContext = createContext();

const WrapperComponentContext = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Get the theme from local storage or use the default
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : lightTheme;
    });
    const width = useScreenWidth()

    // Update local storage whenever the theme changes
    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme));
    }, [theme]);
    return (
        <userContext.Provider value={{ theme, setTheme, width }}>
            {children}
        </userContext.Provider>
    );
};

export {WrapperComponentContext,userContext}