 import React, { useContext, useState } from "react";
import { userContext } from "../context/userContext"; // Import the context
import { useNavigate } from "react-router-dom";
import { BottomBarForMobile, Navbar } from "../components/Navbar";
import ChatListBox from "../components/ChatListBox";
import ConversationBox from "../components/ConversationBox";
import GroupListBox from "../components/GroupListBox";
import GroupSettings from "../components/GroupSettings";
import CallListBox from "../components/CallListBox";
import ProfileSettings from "../components/ProfileSettings";
import Settings from "../components/Settings";
import { SocketContext } from "../context/socketContext";
import CallScreen from "../components/CallScreen";
import UserOrGroupProfile from '../components/UserOrGroupProfile';
import Warning from "../components/Warning";

const Home = () => {
  const {
    theme,
    width,
    middleComponent,
    mainViewForMobile,
    setMainViewForMobile,
    rightComponent,
  } = useContext(userContext); // Access the theme from context
  const navigate = useNavigate();

  if (width > 768) {
    return (
      <div
        className="relative w-full h-dvh overflow-hidden flex items-center justify-start gap-2 transition-all duration-300"
        style={{ backgroundColor: theme.secondary }}
      >
<CallScreen/>
            <Navbar />
            {middleComponent === "chatList" && <ChatListBox />}
            {middleComponent === "groupList" && <GroupListBox />}
            {middleComponent === "callList" && <CallListBox />}
            {rightComponent ==="ConversationBox" && <ConversationBox/>}
            {rightComponent ==="GroupSettings" && <GroupSettings/>}
            {rightComponent ==="UserOrGroupProfile" && <UserOrGroupProfile/>}

            {middleComponent === "settings" && rightComponent ==="settings" && <ProfileSettings />}
            {rightComponent ==="settings" && middleComponent === "settings" && <Settings/>}
      </div>
    );
  }

  if (width <= 768) {
    return (
      <div
        className="relavtive w-dwh max-h-dvh flex items-start justify-start gap-2 flex-col overflow-x-hidden transition-all duration-300 scrollable-for-chat"
        style={{ backgroundColor: theme.secondary }}
      >
<CallScreen/>
      
        {mainViewForMobile === "menuScreen" && (
          <>
            <Navbar />
            {middleComponent === "chatList" && <ChatListBox />}
            {middleComponent === "groupList" && <GroupListBox />}
            {middleComponent === "callList" && <CallListBox />}
            <BottomBarForMobile />
          </>
        )}
        {mainViewForMobile === "settings" && (<div className="w-full h-full flex flex-col items-center justify-start gap-1 transition-all duration-300">
            <ProfileSettings />
            <Settings/>
          </div >
        )}
        {mainViewForMobile === "ConversationBox" && <ConversationBox />}
        {mainViewForMobile === "GroupSettings" && <GroupSettings />}
        {mainViewForMobile === "UserOrGroupProfile" && <UserOrGroupProfile />}
      </div>
    )
  }

  return null;
};

export default Home;
