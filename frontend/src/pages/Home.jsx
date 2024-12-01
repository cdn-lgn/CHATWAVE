import React, { useContext } from "react";
import { userContext } from "../context/userContext"; // Import the context
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatListBox from "../components/ChatListBox";
import ConversationBox from "../components/ConversationBox";

const Home = () => {
  const { theme } = useContext(userContext); // Access the theme from context
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex items-center justify-between" style={{ backgroundColor: theme.secondary }}>
      <Navbar />
      <ChatListBox />
      <ConversationBox />
    </div>
  );
};

export default Home;