import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { userContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
    const user = useSelector(state => state.user.user);
    const { theme } = useContext(userContext);
    const navigate = useNavigate();

    // State for form data with only changed fields
    const [formData, setFormData] = useState({});
    const [profileImage, setProfileImage] = useState(null);

    // Handle input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        // Only add changed fields to formData
        if (value.trim() !== user[id]) {
            setFormData(prevState => ({
                ...prevState,
                [id]: value.trim()
            }));
        } else {
            // Remove the field if it's reverted to original value
            const { [id]: removedField, ...rest } = formData;
            setFormData(rest);
        }
    };

    // Handle profile image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    // Submit handler 
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create FormData for file upload
        const updateData = new FormData();
        
        // Add only changed text fields
        Object.keys(formData).forEach(key => {
            updateData.append(key, formData[key]);
        });

        // Add profile image if selected
        if (profileImage) {
            updateData.append('profileImage', profileImage);
        }

        // Only send if there are changes
        if (Object.keys(formData).length > 0 || profileImage) {
            // Call your update handler
            // updateProfileHandler(updateData)
            console.log('Updated Profile Data:', Object.fromEntries(updateData));
        }
    };

    // Handle back navigation
    const handleBack = () => {
        navigate('/');
    };

    return (
        <div 
            className="flex items-center justify-start md:flex-col w-full"
            style={{ backgroundColor: theme.secondary }}
        >
            <div className="w-full">
                <main className="w-full py-1">
                    <div className="p-2 md:p-4">
                        <div 
                            className="w-full px-6 pb-8 mt-8 sm:rounded-lg"
                            style={{ backgroundColor: theme.background }}
                        >
                            <h2 
                                className="pl-6 text-2xl font-bold sm:text-xl"
                                style={{ color: theme.text }}
                            >
                                Public Profile
                            </h2>

                            <form onSubmit={handleSubmit} className="grid max-w-2xl mx-auto mt-8">
                                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                    <img
                                        className="object-cover w-40 h-40 p-1 rounded-full"
                                        style={{
                                            ringColor: theme.primary,
                                            border: `2px solid ${theme.primary}`
                                        }}
                                        src={profileImage ? URL.createObjectURL(profileImage) : user?.profileImage}
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
                                                hover: { backgroundColor: theme.buttonHover }
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
                                            Your full name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="border text-sm rounded-lg block w-full p-2.5"
                                            style={{
                                                backgroundColor: theme.inputBackground,
                                                borderColor: theme.border,
                                                color: theme.text
                                            }}
                                            placeholder="Your full name"
                                            defaultValue={user?.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-2 sm:mb-6">
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium"
                                            style={{ color: theme.text }}
                                        >
                                            Your email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="border text-sm rounded-lg block w-full p-2.5"
                                            style={{
                                                backgroundColor: theme.inputBackground,
                                                borderColor: theme.border,
                                                color: theme.text
                                            }}
                                            placeholder="your.email@mail.com"
                                            defaultValue={user?.email}
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
                                            Bio
                                        </label>
                                        <textarea
                                            id="about"
                                            rows="4"
                                            className="block w-full text-sm rounded-lg border"
                                            style={{
                                                backgroundColor: theme.inputBackground,
                                                borderColor: theme.border,
                                                color: theme.text
                                            }}
                                            placeholder="Write your bio here..."
                                            defaultValue={user?.about}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                            style={{
                                                backgroundColor: theme.secondary,
                                                color: theme.text
                                            }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={Object.keys(formData).length === 0 && !profileImage}
                                            className="font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                            style={{
                                                backgroundColor: (Object.keys(formData).length === 0 && !profileImage) 
                                                    ? theme.mutedText 
                                                    : theme.button,
                                                color: theme.background,
                                                opacity: (Object.keys(formData ).length === 0 && !profileImage) ? 0.5 : 1
                                            }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfileSettings;