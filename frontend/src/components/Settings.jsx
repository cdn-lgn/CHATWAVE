import React, { useContext, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Switch from "./Switch";  // Import the custom switch component
import { userContext } from "../context/userContext";
import { updateAccountStatus, updateTFAStatus } from '../redux/authUserSlice';
import { darkTheme, lightTheme } from '../constants/theme';
import Warning from "./Warning";  // Import the Warning component
import { registerForTFA, cancelationForTFA } from '../services/TFA';

const API_URL = import.meta.env.VITE_USER_API;

const Settings = () => {
  const { theme, setTheme } = useContext(userContext);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [confirmation, setConfirmation] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);  // State to show the secret passkey modal
  const [secretPasskey, setSecretPasskey] = useState("");  // Store the secret passkey

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
    try {
      const res = await registerForTFA({ name: user.name });

      // Dispatch the update with the verified status
      dispatch(updateTFAStatus(res.verified));

      if (res.verified) {
        // If TFA is verified, show the secret key
        setSecretPasskey(res.secretPasskey);  // Store the secret passkey
        setShowSecretKey(true);  // Show the secret passkey modal
      }
    } catch (error) {
      console.log("Error enabling TFA: ", error);
    }
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
      
      {/* Show confirmation for enabling TFA */}
      {confirmation && !user.TFA && (
        <Warning 
          warningTitle="Are you sure?" 
          warningMessage="If you turn on 2FA and lose your passkey, you cannot access your account!" 
          setConfirmation={setConfirmation} 
          next={enableTFA} 
        />
      )}
      
      {/* Show the secret key modal after 2FA is enabled */}
      {showSecretKey && (
        <Warning 
          warningTitle="Secret Passkey"
          warningMessage={`Your secret passkey: ${secretPasskey}. Keep this safe, as losing it will result in permanent loss of access to your account.`}
          setConfirmation={() => setShowSecretKey(false)} 
          next={() => setShowSecretKey(false)} 
        />
      )}

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
          {/*<div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium">
              Two-Factor Authentication
            </span>
            <Switch checked={user?.TFA === true} onChange={handleTFAChange} />
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default Settings;
