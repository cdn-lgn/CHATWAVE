// new chat search component
import React, { useContext, useState } from "react";
import { userContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import Axios

const searchAllUrl = `${import.meta.env.VITE_USER_API}/search/searchAll`;

const NewUserAndGroupSearchBox = () => {
  const { theme } = useContext(userContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {

      if(searchQuery.trim() === "") return setSearchResult("")
      // Call the backend search API using Axios
      try {
        const response = await axios.get(searchAllUrl, {
          params: { query: searchQuery.trim() }, // Pass the query as a parameter
          withCredentials: true,
        });
        const results = Object.values(response.data.searchResult); // Get the data from the response
        setSearchResult(results); // Update the state with the results
        console.log("Search Results:", results); // Log the results
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
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
      <div className="flex items-center justify-center gap-2 flex-col rounded-xl p-2" style={{background:theme.background}}>
        {searchResult.length > 0 ? (
        searchResult.map((item) => (
          <div
            key={item._id} // Add a unique key prop
            className="flex items-center gap-4 w-full rounded-lg cursor-pointer"
            style={{ background: theme.border }}
          >
            {/* Profile Image */}
            <img
              src={item?.profileImage}
              alt={item?.name}
              className="w-12 h-12 rounded-full object-cover"
            />

            {/* Item Details */}
            <div>
              <div className="flex items-center justify-between">
                <h5 className="font-medium font-extrabold" style={{ color: theme.text }}>
                  {item?.name}
                </h5>
                {item?.entityType === "group" && (
                  <p className="text-[12px]" style={{ color: theme.mutedText }}>
                    {item?.entityType}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: theme.mutedText }}>enter name and search</p> //press enter
      )}
      </div>
    </div>
  );
};

export default NewUserAndGroupSearchBox;