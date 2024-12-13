import React, { useContext, useState } from "react";
import {useSelector} from "react-redux"
import { userContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const searchAllUrl = `${import.meta.env.VITE_USER_API}/search/searchAll`;

const NewUserAndGroupSearchBox = () => {
  const { theme,receiver, setReceiver } = useContext(userContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const chatList = useSelector(state=>state.chatList.chatList)

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      if (searchQuery.trim() === "") return setSearchResult("");
      // Call the backend search API using Axios
      try {
        const response = await axios.get(searchAllUrl, {
          params: { query: searchQuery.trim() },
          withCredentials: true,
        });
        setSearchResult(response.data.searchResult); // Update the state with the results
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  const clickOnSearchResult = (item) => {
    const foundChat = Object.values(chatList).find((chat) => {
        if (item.entityType === "group") {
            return item._id === chat.groupID;
        } else {
            return item._id === chat.participantID;
        }
    });
    if (foundChat) {
        setReceiver(foundChat); // If chat exists, set receiver
    } else {
        setReceiver(item); // If no match, set item as receiver
    }
};


  return (
    <div>
      <div className="relative mb-4">
        <input
          type="search"
          placeholder="Search ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
          style={{
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          }}
          className="w-full p-3 pl-10 text-sm rounded-lg border"
          onKeyDown={handleKeyDown} // Use onKeyDown instead of onKeyPress
        />
        <FontAwesomeIcon
          icon={faSearch}
          style={{ color: theme.mutedText }}
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        />
      </div>
      {/* Search result (users and groups) */}
      <div
        className="flex items-center justify-center gap-2 flex-col rounded-xl p-2"
        style={{ background: theme.background }}
      >
        {searchResult.length > 0 ? (
          searchResult.map((item) => (
            <div
              key={item._id} // Add a unique key prop
              className="flex items-center gap-2 w-full rounded-lg cursor-pointer"
              style={{ background: theme.border }}
              onClick={()=>clickOnSearchResult(item)}
            >
              {/* Profile Image */}
              <img
                src={item?.profileImage}
                alt={item?.name}
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Item Details */}
              <div className="flex flex-col w-full">
                {/* Group Name and Entity Type */}
                <div className="flex justify-between items-center w-full px-2">
                  <h5
                    className="font-medium font-extrabold"
                    style={{ color: theme.text }}
                  >
                    {item?.name}
                  </h5>

                  {/* Entity Type (e.g., "group") */}
                  {item?.entityType === "group" && (
                    <p
                      className="text-[12px]"
                      style={{ color: theme.mutedText }}
                    >
                      {item?.entityType}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: theme.mutedText }}>enter name and search</p>
        )}
      </div>
    </div>
  );
};

export default NewUserAndGroupSearchBox;
