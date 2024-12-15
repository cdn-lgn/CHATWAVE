import React, { useContext, useState } from "react";
import { userContext } from "../context/userContext"; // Import the context
import { useNavigate } from "react-router-dom";
import { BottomBarForMobile, Navbar } from "../components/Navbar";
import ChatListBox from "../components/ChatListBox";
import ConversationBox from "../components/ConversationBox";
import GroupListBox from "../components/GroupListBox";
import CallListBox from "../components/CallListBox";
import ProfileSettings from "../components/ProfileSettings";
import { SocketContext } from "../context/socketContext";
import CallScreen from "../components/CallScreen";

const Home = () => {
  const {
    theme,
    width,
    middleComponent,
    mainViewForMobile,
    setMainViewForMobile,
  } = useContext(userContext); // Access the theme from context
  const navigate = useNavigate();
  const { callStatus } = useContext(SocketContext);

  if (width > 768) {
    return (
      <div
        className="w-screen h-screen flex items-start justify-start gap-1 transition-all duration-300"
        style={{ backgroundColor: theme.secondary }}
      >
        {callStatus != "" && <CallScreen />}
        {mainViewForMobile === "menuScreen" && (
          <>
            <Navbar />
            {middleComponent === "chatList" && <ChatListBox />}
            {middleComponent === "groupList" && <GroupListBox />}
            {middleComponent === "callList" && <CallListBox />}
            <ConversationBox />
          </>
        )}
        {mainViewForMobile === "settings" && (
          <>
            <ProfileSettings />
          </>
        )}
      </div>
    );
  }

  if (width <= 768) {
    return (
      <div
        className="w-screen h-screen flex items-center justify-start gap-1 flex-col transition-all duration-300"
        style={{ backgroundColor: theme.secondary }}
      >
        {callStatus != "" && <CallScreen />}
        {mainViewForMobile === "menuScreen" && (
          <>
            <Navbar />
            {middleComponent === "chatList" && <ChatListBox />}
            {middleComponent === "groupList" && <GroupListBox />}
            {middleComponent === "callList" && <CallListBox />}
            <BottomBarForMobile />
          </>
        )}
        {mainViewForMobile === "settings" && (
          <>
            <ProfileSettings />
          </>
        )}
        {mainViewForMobile === "ConversationBox" && <ConversationBox />}
      </div>
    );
  }

  return null;
};

export default Home;
