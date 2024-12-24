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

const Home = () => {
  const {
    theme,
    width,
    middleComponent,
    mainViewForMobile,
    setMainViewForMobile,
    rightComponent
  } = useContext(userContext); // Access the theme from context
  const navigate = useNavigate();
  const { callStatus } = useContext(SocketContext);

  if (width > 768) {
    return (
      <div
        className="w-full h-dvh flex items-center justify-start gap-2 transition-all duration-300"
        style={{ backgroundColor: theme.secondary }}
      >

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
        className="w-screen h-dvh flex items-center justify-center gap-2 flex-col transition-all duration-300 scrollable-for-chat"
        style={{ backgroundColor: theme.secondary }}
      >
        {/*{callStatus != "" && <CallScreen />}*/}
        {mainViewForMobile === "menuScreen" && (
          <>
            <Navbar />
            {middleComponent === "chatList" && <ChatListBox />}
            {middleComponent === "groupList" && <GroupListBox />}
            {middleComponent === "callList" && <CallListBox />}
            <BottomBarForMobile />
          </>
        )}
        {mainViewForMobile === "settings" && (<div className="w-full min-h-full flex flex-col items-center justify-start gap-1 flex-col transition-all duration-300">
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
