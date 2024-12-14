import React, { useContext, useState } from "react";
import { userContext } from "../context/userContext"; // Import the context
import { useNavigate } from "react-router-dom";
import { BottomBarForMobile, Navbar } from "../components/Navbar";
import ChatListBox from "../components/ChatListBox";
import ConversationBox from "../components/ConversationBox";
import GroupListBox from "../components/GroupListBox";
import CallListBox from "../components/CallListBox";

const Home = () => {
  const {
    theme,
    width,
    middleComponent,
    mainViewForMobile,
    setMainViewForMobile,
  } = useContext(userContext); // Access the theme from context
  const navigate = useNavigate();


  if (width > 768) {
    return (
      <div
        className="w-screen h-screen flex items-start justify-start gap-1 transition-all duration-300"
        style={{ backgroundColor: theme.secondary }}
      >
        <Navbar />
        {middleComponent === "chatList" && <ChatListBox />}
        {middleComponent === "groupList" && <GroupListBox />}
        {middleComponent === "callList" && <CallListBox />}
        <ConversationBox />
      </div>
    );
  }

  if (width <= 768) {
    return (
      <div
        className="w-screen h-screen flex items-center justify-start gap-1 flex-col transition-all duration-300"
        style={{ backgroundColor: theme.secondary }}
      >
        {mainViewForMobile === "menuScreen" && (
          <>
            <Navbar />
            {middleComponent === "chatList" && <ChatListBox />}
            {middleComponent === "groupList" && <GroupListBox />}
            {middleComponent === "callList" && <CallListBox />}
            <BottomBarForMobile />
          </>
        )}
        {mainViewForMobile === "ConversationBox" && <ConversationBox />}
      </div>
    );
  }

  return null;
};

export default Home;
