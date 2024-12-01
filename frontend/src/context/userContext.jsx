import { createContext, useEffect, useState } from "react";
import {darkTheme, lightTheme} from '../constants/theme.js'


const userContext = createContext();

const WrapperComponentContext = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Get the theme from local storage or use the default
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : lightTheme;
    });

    // Update local storage whenever the theme changes
    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme));
    }, [theme]);
    return (
        <userContext.Provider value={{ theme, setTheme }}>
            {children}
        </userContext.Provider>
    );
};

export {WrapperComponentContext,userContext}