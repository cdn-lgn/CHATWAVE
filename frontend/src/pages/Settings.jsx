import React, { useContext, useState } from "react";
import {useSelector} from 'react-redux'
import { userContext } from "../context/userContext"; // Import the context
import { useNavigate } from "react-router-dom";
import ProfileSettings from "../components/ProfileSettings";

const Settings = () => {
  const { theme, width } = useContext(userContext); // Access the theme from context
  const navigate = useNavigate();
  const user = useSelector(state=>state.user.user)


  return (
    <div className="flex items-center justify-start md:flex-col w-full" style={{background:theme.background}}>
        
<ProfileSettings/>
        
    </div>
  )
};

export default Settings;
