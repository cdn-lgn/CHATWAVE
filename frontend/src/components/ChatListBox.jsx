import React, { useContext, useState, useEffect, useRef } from "react";
import {useSelector} from "react-redux"
import UserGroupCardForList from "./UserGroupCardForList";
import { userContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faComment,
  faUsers,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import NewUserAndSearchBox from "./NewUserAndSearchBox";
import CreateNewGroupBox from "./CreateNewGroupBox";
import useFetchChatList from '../hooks/chatListHook';

const ChatListBox = () => {
  useFetchChatList(); 
  const chatList = useSelector(state=>state.chatList.chatList)
  const { theme, width } = useContext(userContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [plusOptions, setPlusOptions] = useState(false);
  const dropdownRef = useRef(null);
  const [newUserSearchTab, setNewUserSearchTab] = useState(false);
  const [newGroupTab, setNewGroupTab] = useState(false);

  // Handle search term input
  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Toggle plus options
  const plusButtonHandler = () => {
    setPlusOptions((prev) => !prev);
  };

  // Filter the chat list based on the search term
  const filteredChatList = Object.values(chatList)?.filter(chat => chat?.participant?.name?.toLowerCase().includes(searchTerm.toLowerCase()));


  // Close the dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setPlusOptions(false);
    }
  };

  // Add event listener for clicking outside the dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div
      style={{ backgroundColor: theme.background }}
      className={`p-4 h-full relative z-10 ${width <= 768 ? "min-w-full" : "w-1/3"}`}
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
        {filteredChatList?.length > 0 ? (
          filteredChatList?.map((chat, index) => (
            <UserGroupCardForList
              key={index}
              userOrGroup={chat}
              theme={theme}
            />
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
            className="mt-2 w-40 bg-white shadow-lg rounded-lg transition-transform duration-300 transform scale-100 opacity-100 mb-2"
            style={{ height: "auto" ,background:theme.secondary ,color: theme.text }}
          >
            <div
              className="flex rounded-lg items-center p-2 hover:shadow-2xl cursor-pointer"
              onClick={() => setNewUserSearchTab(true)}
            >
              <FontAwesomeIcon
                icon={faComment}
                className="mr-2"
              />
              <span>New Chat</span>
            </div>
            {/*goup functionality stopped for now*/}
            <div
              className="flex rounded-lg items-center p-2 hover:shadow-2xl cursor-pointer"
              onClick={() => setNewGroupTab(true)}
            >
              <FontAwesomeIcon
                icon={faUsers}
                className="mr-2"
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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-2 rounded-xl w-full sm:w-1/2 lg:w-1/3" // Adjusted width classes
            style={{ background: theme.border }}
          >
            <div className="flex items-center justify-end bottom-2 right-2 pb-2">
              <FontAwesomeIcon
                icon={faClose}
                onClick={() => setNewUserSearchTab(false)}
                className="cursor-pointer text-2xl"
              />
            </div>
            <NewUserAndSearchBox setNewUserSearchTab={setNewUserSearchTab}/>
          </div>
        </>
      )}

      {/* New Group Create Tab */}
      {newGroupTab && (
        <>
          <div
            className="fixed bg-black top-0 left-0 opacity-50 w-screen h-screen"
            onClick={() => setNewGroupTab(false)}
          />
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-2 rounded-xl w-full sm:w-1/2 lg:w-1/3" // Adjusted width classes
            style={{ background: theme.border }}
          >
            <div className="flex items-center justify-end bottom-2 right-2 pb-2">
              <FontAwesomeIcon
                icon={faClose}
                onClick={() => setNewGroupTab(false)}
                className="cursor-pointer text-2xl"
              />
            </div>
            <CreateNewGroupBox setNewGroupTab={setNewGroupTab} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatListBox;
