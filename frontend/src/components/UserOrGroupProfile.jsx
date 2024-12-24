import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { userContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const API_URL = import.meta.env.VITE_USER_API;

const UserOrGroupProfile = () => {
    const { theme, receiver,setReceiver } = useContext(userContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [members, setMembers] = useState([]);
    const user = useSelector((state) => state.user.user);

    console.log(receiver)

    // Fetch group members when receiver is a group
    useEffect(() => {
        if (receiver.isGroupChat && receiver.group) {
            fetchGroupMembers(receiver.group._id);
        }
    }, [receiver]);

    const fetchGroupMembers = async (groupID) => {
        try {
            const response = await axios.get(
                `${API_URL}/groups/members/${groupID}`,
                { withCredentials: true }
            );
            setMembers(response.data.members);  // Store members in state
        } catch (error) {
            console.error("Error fetching group members:", error);
        }
    };

    // Handle search key press
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

    // Handle adding a new member to the group
    const addNewMember = async (newMember) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_USER_API}/groups/addMember`, 
                { groupID: receiver.group._id, member: newMember._id },
                { withCredentials: true }
            );
            console.log("Added new member:", response);
            setMembers((prevMembers) => [...prevMembers, newMember]);  // Update members in UI
        } catch (error) {
            console.error('Error adding new member:', error);
        }
    };

    // Check if the receiver is a group or user and render accordingly
    if (!receiver) return null; // Handle case when receiver is not available

    return (
        <div
            className="flex h-dvh items-start justify-start md:flex-col w-full md:w-2/3 scrollable-container overflow-auto rounded-lg"
            style={{ backgroundColor: theme.secondary }}
        >
            <div className="w-full rounded-lg"  style={{ backgroundColor: theme.background }}>
                <main className="w-full">
                    <div className="py-2">
                        <div
                            className="w-full px-6 pb-6"
                            
                        >

                            {/* Conditional Rendering Based on receiver.isGroupChat */}
                            {receiver?.isGroupChat ? (
                                // Group Profile View
                                <>
                                    <div className="mt-8">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <img
                                                className="object-cover w-40 h-40 p-1 rounded-full"
                                                draggable="false"
                                                style={{ border: `2px solid ${theme.button}` }}
                                                src={receiver.group?.profileImage ||""}
                                                alt="Group Profile"
                                            />
                                            <div className="flex flex-col items-center justify-center">
                                                <h3 className="text-xl" style={{ color: theme.text }}>
                                                    {receiver.group?.name}
                                                </h3>
                                                <p
                                                    className="text-sm"
                                                    style={{ color: theme.mutedText }}
                                                >
                                                    {receiver.group?.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Group Members */}
                                        <div className="mt-8">
                                            <h3
                                                className="text-xl font-bold"
                                                style={{ color: theme.text }}
                                            >
                                                Members
                                            </h3>
                                            <div className="flex flex-col gap-4 mt-4">
                                                {members.map((member) => (
                                                    <div
                                                        key={member._id}
                                                        className="w-full flex items-center justify-between p-2 rounded-lg"
                                                        style={{
                                                            backgroundColor: theme.inputBackground,
                                                            borderColor: theme.border,
                                                        }}
                                                    >
                                                        <div className="flex items-center" 
                                                                style={{ color: theme.text }}>
                                                            <img
                                                                className="w-8 h-8 rounded-full"
                                                                src={member.profileImage}
                                                                alt={member.name}
                                                            />
                                                            <span
                                                                className="ml-3 text-sm pr-2"
                                                            >
                                                                {member.name}
                                                            </span>
                                                            {member._id == receiver?.group?.owner?._id && (<p>(Owner)</p>)}
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // User Profile View
                                <div className="mt-8">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <img
                                            className="object-cover w-40 h-40 p-1 rounded-full"
                                            draggable="false"
                                            style={{ border: `2px solid ${theme.button}` }}
                                            src={receiver?.participant?.profileImage || receiver.profileImage}
                                            alt="User Profile"
                                        />
                                        <div className="flex flex-col items-center justify-center">
                                            <h3 className="text-xl" style={{ color: theme.text }}>
                                                {receiver?.participant?.name || receiver.name}
                                            </h3>
                                            <p
                                                className="text-sm"
                                                style={{ color: theme.mutedText }}
                                            >
                                                {receiver?.participant?.about || receiver.about}
                                            </p>
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

export default UserOrGroupProfile;
