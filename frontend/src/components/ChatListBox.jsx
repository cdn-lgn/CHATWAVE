import React, { useContext, useState, useEffect, useRef } from "react";
import UserGroupListCard from "./UserGroupListCard";
import { userContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faComment,
  faUsers,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import NewUserSearchBox from "./NewUserSearchBox";

const ChatListBox = () => {
  const { theme, width } = useContext(userContext); // Get theme context
  const [searchTerm, setSearchTerm] = useState("");
  const [plusOptions, setPlusOptions] = useState(false);
  const dropdownRef = useRef(null); // Create a ref for the dropdown
  const [newUserSearchTab, setNewUserSearchTab] = useState(false);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const plusButtonHandler = () => {
    setPlusOptions((prev) => !prev);
  };

  // Example Chat Data
  const chatList = [
    {
      name: "Tania Andrew",
      profileImage: "https://i.pravatar.cc/100?img=1",
      lastMessage: "Let’s catch up tomorrow!",
      entityType:"user",
      time: "10:30 AM",

    },
    {
      name: "Jacob Jones",
      profileImage: "https://i.pravatar.cc/100?img=2",
      lastMessage: "Can you review the document?",
      entityType:"user",
      time: "1d",
    },
    {
      name: "Emily Smith",
      profileImage: "https://i.pravatar.cc/100?img=3",
      lastMessage: "Sure, let me know the details.",
      entityType:"user",
      time: "2d",
    },
    {
      name: "Candice Johnson",
      profileImage: "https://i.pravatar.cc/100?img=4",
      lastMessage: "Meeting rescheduled to 4 PM.",
      entityType:"user",
      time: "3d",
    },
  ];

  const filteredChatList = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setPlusOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{ backgroundColor: theme.background }}
      className={`p-4 h-full relative ${width <= 768 ? "min-w-full" : "w-1/3"}`}
    >
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search chats..."
          style={{
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          }}
          className="w-full p-3 pl-10 text-sm rounded-lg border"
        />
        <FontAwesomeIcon
          icon={faSearch}
          style={{ color: theme.mutedText }}
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        />
      </div>

      {/* Chat List */}
      <div className="space-y-3">
        {filteredChatList.length > 0 ? (
          filteredChatList.map((chat, index) => (
            <UserGroupListCard key={index} userOrGroup={chat} theme={theme} />
          ))
        ) : (
          <p style={{ color: theme.mutedText }} className="text-center">
            No chats found.
          </p>
        )}
      </div>

      {/* Plus Button */}
      <div
        ref={dropdownRef}
        className="absolute bottom-3 right-3 flex flex-col items-end justify-center"
      >
        {plusOptions && (
          <div
            className="mt-2 w-40 bg-white shadow-lg rounded-lg transition-transform duration-300 transform scale-100 opacity-100"
            style={{ height: "auto" }}
          >
            <div
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => setNewUserSearchTab(true)}
            >
              <FontAwesomeIcon
                icon={faComment}
                className="mr-2"
                style={{ color: theme.text }}
              />
              <span>New Chat</span>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
              <FontAwesomeIcon
                icon={faUsers}
                className="mr-2"
                style={{ color: theme.text }}
              />
              <span>Create Group</span>
            </div>
          </div>
        )}
        <FontAwesomeIcon
          icon={faPlus}
          style={{ color: theme.background, background: theme.button }}
          className="rounded-full p-2 flex items-center justify-center transition-transform duration-300 hover:scale-110 w-6 h-6"
          onClick={plusButtonHandler}
        />
      </div>

      {/* New User Search Tab */}
      {newUserSearchTab && (
        <>
          <div
            className="fixed bg-black top-0 left-0 opacity-50 w-screen h-screen"
            onClick={() => setNewUserSearchTab(false)}
          />
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-2 rounded-xl"
            style={{ background: theme.border }}
          >
            <div className=" flex items-center justify-end bottom-2 right-2">
              <FontAwesomeIcon
                icon={faClose}
                onClick={() => setNewUserSearchTab(false)}
                className="cursor-pointer"
              />
            </div>
            <NewUserSearchBox setNewUserSearchTab={setNewUserSearchTab} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatListBox;
