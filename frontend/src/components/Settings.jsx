import React, { useContext, useState,useEffect } from "react";
import axios from "axios"
import { useDispatch,useSelector } from "react-redux";
import Switch from "./Switch";  // Import the custom switch component
import { userContext } from "../context/userContext";
import { updateAccountStatus } from '../redux/authUserSlice';
import { darkTheme,lightTheme } from '../constants/theme';

const API_URL = import.meta.env.VITE_USER_API

const Settings = () => {
  const {theme,setTheme} = useContext(userContext)
  const user = useSelector(state=>state.user.user)
  const dispatch = useDispatch()
  const [isChecked3, setIsChecked3] = useState(false);
  console.log("theme ",theme)

  const handleHideAccount = async() => {
    try {
      const response = await axios.patch(`${API_URL}/user/hideAccount`,{hideUser: user.hiddenAccount},{withCredentials:true})
      await dispatch(updateAccountStatus(response?.data?.hiddenAccount))
    } catch (error) {
        console.log(error);
    }
  }
  const handleDarkModeChange = () =>{
    setTheme ((prevTheme)=>prevTheme.background==lightTheme.background ? darkTheme : lightTheme)
  };
  const handleToggleChange3 = () => setIsChecked3(prev => !prev);

  return (
    <div className="w-full items-start justify-start h-full rounded-lg overflow-hidden" style={{ backgroundColor: theme.secondary,color:theme.text }}>
      <div className="w-full px-6 pb-8 rounded-lg" style={{ backgroundColor: theme.background }}>
        <h2 className="text-2xl font-bold sm:text-xl" style={{ color: theme.text }}>
          Other settings
        </h2>
        <div className="mt-8 flex flex-col gap-3">
          {/* First Setting */}
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium">
              Hide Account
            </span>
            <Switch checked={user?.hiddenAccount} onChange={handleHideAccount} />
          </div>

          {/* Second Setting */}
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium">
              Dark Mode
            </span>
            <Switch checked={theme.background==darkTheme.background} onChange={handleDarkModeChange} />
          </div>

          {/* Third Setting */}
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium">
              Hide Two Factor Authentication
            </span>
            <Switch checked={isChecked3} onChange={handleToggleChange3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
