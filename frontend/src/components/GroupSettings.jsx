import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { userContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faSearch, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const searchAllUrl = `${import.meta.env.VITE_USER_API}/search/searchAll`;

const GroupSettings = () => {
    const { theme, groupForEdit, setReceiver, setMainViewForMobile, setRightComponent } = useContext(userContext);
    const [formData, setFormData] = useState({
        name: groupForEdit?.name || "",
        description: groupForEdit?.description || "",
    });
    const [profileImage, setProfileImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
    const [members, setMembers] = useState([]);  // State to store members
    const user = useSelector(state => state.user.user); // Current user from Redux

    // Fetch group members on component mount
    useEffect(() => {
        if (groupForEdit) {
            fetchGroupMembers(groupForEdit._id);
        }
    }, [groupForEdit]);

    const fetchGroupMembers = async (groupID) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_USER_API}/groups/members/${groupID}`, { withCredentials: true });
            setMembers(response.data.members);  // Store members in state
        } catch (error) {
            console.error("Error fetching group members:", error);
        }
    };

    // Handle input changes for group form
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value.trim(),
        }));
    };

    // Handle profile image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    // Handle adding new member
    const addNewMember = async (newMember) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_USER_API}/groups/addMember`, 
                { groupID: groupForEdit._id, member: newMember._id },
                { withCredentials: true }
            );
            console.log('Added new member:', response);
            setMembers((prevMembers) => [...prevMembers, newMember]);  // Update members in UI
        } catch (error) {
            console.error('Error adding new member:', error);
        }
    };

    // Handle removing a member
    const removeMember = async (memberId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_USER_API}/groups/removeMember`, 
                { groupID: groupForEdit._id, member: memberId },
                { withCredentials: true }
            );
            console.log('Removed member:', response.data);
            setMembers(members.filter((member) => member._id !== memberId));  // Update members in UI
        } catch (error) {
            console.error("Error removing member:", error);
        }
    };

    // Handle keydown for search
    const handleKeyDown = async (event) => {
        if (event.key === "Enter" && searchQuery.trim() !== "") {
            try {
                const response = await axios.get(searchAllUrl, {
                    params: { query: searchQuery.trim() },
                    withCredentials: true,
                });
                setSearchResult(response.data.searchResult);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        }
    };

    // Handle search result click
    const clickOnSearchResult = (item) => {
        try {
            addNewMember(item);
            setShowAddMemberPopup(false); // Close the popup after adding
        } catch (error) {
            console.log(error);
        }
    };

    // Function to update the group details
    const updateGroup = async () => {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("name", formData.name);
        formDataToSubmit.append("description", formData.description);
        if (profileImage) {
            formDataToSubmit.append("profileImage", profileImage);
        }

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_USER_API}/groups/update/${groupForEdit._id}`,
                formDataToSubmit,
                { withCredentials: true }
            );
            console.log("Group updated successfully:", response);
            setReceiver(response.data.group);  // Optionally update the group in context
        } catch (error) {
            console.error("Error updating group:", error);
        }
    };

    // Check if the current user is the owner of the group
    const isOwner = groupForEdit?.owner._id === user?._id;

    if (!groupForEdit) return null;

    return (
    <div className="flex h-full items-start justify-start md:flex-col w-full md:w-2/3 scrollable-container overflow-auto" style={{ backgroundColor: theme.secondary }}>
        <div className="w-full">
            <main className="w-full">
                <div>
                    
                    <div className="w-full px-6 pb-6 rounded-lg" style={{ backgroundColor: theme.background }}>
                    <FontAwesomeIcon
                                                                    icon={faChevronLeft}
                                                                    className="md:hidden pt-4 h-[20px] w-[20px] cursor-pointer"
                                                                    onClick={() =>
                                                                        setMainViewForMobile("menuScreen")
                                                                    }
                                                                    style={{color:theme.text}}
                                                                />
                        <h2 className="text-2xl font-bold sm:text-xl" style={{ color: theme.text }}>Group Profile</h2>
                        
                        {/* Group Edit Form (Visible only for the owner) */}
                        {isOwner && (
                            <div className="mt-8">
                                <form className="grid max-w-2xl mx-auto mt-8" onSubmit={(e) => { e.preventDefault(); updateGroup(); }}>
                                    <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                        <img
                                            className="object-cover w-40 h-40 p-1 rounded-full"
                                            draggable="false"
                                            style={{ border: `2px solid ${theme.button}` }}
                                            src={profileImage ? URL.createObjectURL(profileImage) : groupForEdit?.profileImage}
                                            alt="Profile"
                                        />
                                        <div className="flex flex-col space-y-5 sm:ml-8">
                                            <input
                                                type="file"
                                                id="profileImageUpload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            <label
                                                htmlFor="profileImageUpload"
                                                className="py-3.5 px-7 text-base font-medium rounded-lg cursor-pointer"
                                                style={{
                                                    backgroundColor: theme.button,
                                                    color: theme.background,
                                                }}
                                            >
                                                Change picture
                                            </label>
                                        </div>
                                    </div>

                                    <div className="items-center mt-8 sm:mt-14">
                                        <div className="mb-2 sm:mb-6">
                                            <label
                                                htmlFor="name"
                                                className="block mb-2 text-sm font-medium"
                                                style={{ color: theme.text }}
                                            >
                                                Group Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="border text-sm rounded-lg block w-full p-2.5"
                                                style={{
                                                    backgroundColor: theme.inputBackground,
                                                    borderColor: theme.border,
                                                    color: theme.text,
                                                }}
                                                placeholder="Group Name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label
                                                htmlFor="about"
                                                className="block mb-2 text-sm font-medium"
                                                style={{ color: theme.text }}
                                            >
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                rows="4"
                                                className="block w-full text-sm rounded-lg border p-1"
                                                style={{
                                                    backgroundColor: theme.inputBackground,
                                                    borderColor: theme.border,
                                                    color: theme.text,
                                                }}
                                                placeholder="Write a description..."
                                                value={formData.description}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>

                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                type="button"
                                                className="font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                                style={{
                                                    backgroundColor: theme.button,
                                                    color: theme.background,
                                                }}
                                                onClick={updateGroup}
                                            >
                                                Update Group
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Members List (Always visible) */}
                        <div className="w-full md:w-1/2 mt-8">
                            <h2 className="text-2xl font-bold sm:text-xl" style={{ color: theme.text }}>Members</h2>
                            <div className="w-full flex flex-col items-center justify-between gap-4 mt-4">
                                {/* Show Owner at the Top */}
                                {members
                                    .filter((member) => member._id === groupForEdit.owner._id) // Filter owner member to show at the top
                                    .map((owner) => (
                                        <div
                                            key={owner._id}
                                            className="w-full flex items-center justify-between p-2 rounded-lg"
                                            style={{
                                                backgroundColor: theme.inputBackground,
                                                borderColor: theme.border,
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    className="w-8 h-8 rounded-full"
                                                    src={owner.profileImage}
                                                    alt={owner.name}
                                                />
                                                <span className="ml-3 text-sm" style={{ color: theme.text }}>
                                                    {owner.name} (Owner)
                                                </span>
                                            </div>
                                            {/* Don't show cross for owner */}
                                            {isOwner && owner._id !== user._id && (
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => removeMember(owner._id)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                
                                {/* Show Other Members */}
                                {members
                                    .filter((member) => member._id !== user._id && member._id !== groupForEdit.owner._id) // Filter out the logged-in user and owner
                                    .map((member) => (
                                        <div
                                            key={member._id}
                                            className="w-full flex items-center justify-between p-2 rounded-lg"
                                            style={{
                                                backgroundColor: theme.inputBackground,
                                                borderColor: theme.border,
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    className="w-8 h-8 rounded-full"
                                                    src={member.profileImage}
                                                    alt={member.name}
                                                />
                                                <span className="ml-3 text-sm" style={{ color: theme.text }}>
                                                    {member.name}
                                                </span>
                                            </div>
                                            {/* Show cross icon for non-owner members (except the logged-in user) */}
                                            {isOwner && member._id !== user._id && (
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => removeMember(member._id)}
                                                />
                                            )}
                                        </div>
                                    ))}

                                {/* Add Member Button (Only for owner) */}
                                {isOwner && (
                                    <button
                                        onClick={() => setShowAddMemberPopup(true)}
                                        className="mt-5 px-5 py-2.5 text-sm text-center rounded-lg"
                                        style={{
                                            backgroundColor: theme.button,
                                            color: theme.background,
                                        }}
                                    >
                                        Add Member
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Add Member Popup */}
                        {showAddMemberPopup && (
                            <div
                                className="absolute top-0 left-0 right-0 bottom-0 z-20 bg-gray-500 bg-opacity-50 flex items-center justify-center"
                                onClick={() => setShowAddMemberPopup(false)}
                            >
                                <div className="p-4 rounded-lg shadow-md max-w-xl w-full" style={{ background: theme.background }} onClick={(e) => e.stopPropagation()}>
                                    <div className="relative mb-4">
                                        <input
                                            type="search"
                                            placeholder="Search for users..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full p-3 pl-10 text-sm rounded-lg border"
                                            style={{
                                                backgroundColor: theme.inputBackground,
                                                color: theme.text,
                                                borderColor: theme.border,
                                            }}
                                        />
                                        <FontAwesomeIcon
                                            icon={faSearch}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                            style={{ color: theme.mutedText }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-center gap-2 flex-col rounded-xl p-2">
                                        {searchResult.length > 0 ? (
                                            searchResult.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="flex items-center p-1 gap-1 w-full rounded-lg "
                                                    style={{ background: theme.border }}
                                                >
                                                    <div className="w-14 h-full rounded-full overflow-hidden">
                                                        <img
                                                            src={item?.profileImage}
                                                            alt={item?.name}
                                                            className="object-cover w-12 h-12 rounded-full"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full">
                                                        <div className="flex justify-between items-center w-full px-2">
                                                            <h5 className="font-medium font-extrabold" style={{ color: theme.text }}>
                                                                {item?.name}
                                                            </h5>
                                                            <FontAwesomeIcon
                                                                icon={faPlus}
                                                                className="cursor-pointer text-green-500"
                                                                onClick={() => clickOnSearchResult(item)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ color: theme.mutedText }}>No users found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    </div>
);

};

export default GroupSettings;
