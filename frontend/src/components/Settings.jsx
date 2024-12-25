import React, { useContext, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Switch from "./Switch";  // Import the custom switch component
import { userContext } from "../context/userContext";
import { updateAccountStatus, updateTFAStatus } from '../redux/authUserSlice';
import { darkTheme, lightTheme } from '../constants/theme';
import Warning from "./Warning";
import { registerForTFA, cancelationForTFA } from '../services/TFA';

const API_URL = import.meta.env.VITE_USER_API;

const Settings = () => {
  const { theme, setTheme } = useContext(userContext);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [confirmation, setConfirmation] = useState(false);

  const handleHideAccount = async () => {
    try {
      const response = await axios.patch(`${API_URL}/user/hideAccount`, { hideUser: user.hiddenAccount }, { withCredentials: true });
      await dispatch(updateAccountStatus(response?.data?.hiddenAccount));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDarkModeChange = () => {
    setTheme(prevTheme => prevTheme.background === lightTheme.background ? darkTheme : lightTheme);
  };

  const enableTFA = async () => {
    console.log("TFA registration started");
    const res = await registerForTFA({ name: user.name });
    dispatch(updateTFAStatus(res));
  };

  const disableTFA = async () => {
    console.log("TFA cancellation started");
    const res = await cancelationForTFA();
    dispatch(updateTFAStatus(res));
  };

  const handleTFAChange = () => {
    if (user.TFA) {
      disableTFA();
    } else {
      setConfirmation(true);
    }
  };

  return (
    <div className="w-full items-start justify-start h-full rounded-lg overflow-x-hidden" style={{ backgroundColor: theme.secondary, color: theme.text }}>
      {confirmation && !user.TFA && <Warning warningTitle={"Are you sure?"} warningMessage={"If you turn on 2FA and lose your passkey, you cannot access your account!"} setConfirmation={setConfirmation} next={enableTFA} />}
      <div className="w-full px-6 pb-8 rounded-lg pt-4" style={{ backgroundColor: theme.background }}>
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
            <Switch checked={theme.background === darkTheme.background} onChange={handleDarkModeChange} />
          </div>

          {/* Third Setting */}
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium">
              Two-Factor Authentication
            </span>
            <Switch checked={user?.TFA === true} onChange={handleTFAChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
