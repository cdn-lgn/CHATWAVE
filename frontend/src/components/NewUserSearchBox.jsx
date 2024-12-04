import React, { useContext, useState } from "react";
import { userContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import Axios

const searchAllUrl = `${import.meta.env.VITE_USER_API}/search/searchAll`;

const NewUserSearchBox = () => {
  const { theme } = useContext(userContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("")

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed");

      // Call the backend search API using Axios
      try {
        const response = await axios.get(searchAllUrl, {
          params: { query: searchQuery }, // Pass the query as a parameter
          withCredentials: true,
        });
        setSearchResult(response.data.searchResult); // Get the data from the response
        console.log("Search Results:", response.data.searchResult); // Handle the search results as needed
        // You can update the state or do something with the results here
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
          onKeyPress={handleKeyPress} // Add the onKeyPress event handler
        />
        <FontAwesomeIcon
          icon={faSearch}
          style={{ color: theme.mutedText }}
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        />
      </div>

      
    </div>
  );
};

export default NewUserSearchBox;
