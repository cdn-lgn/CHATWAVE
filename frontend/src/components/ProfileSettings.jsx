import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";
import { userContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/authUserSlice";

const updateUserUrl = `${import.meta.env.VITE_USER_API}/user/updateUser`;

const ProfileSettings = () => {
    const user = useSelector((state) => state.user.user);
    const {
        theme,
        setMainViewForMobile,
        setMiddleComponent,
        setRightComponent,
        receiver,
    } = useContext(userContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State for form data with only changed fields
    const [formData, setFormData] = useState({});
    const [profileImage, setProfileImage] = useState(null);

    // Handle input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        // Only add changed fields to formData
        if (value.trim() !== user[id]) {
            setFormData((prevState) => ({
                ...prevState,
                [id]: value.trim(),
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

    const handleBackClick = () => {
        setMainViewForMobile("menuScreen");
        setMiddleComponent("chatList");
        setRightComponent(receiver ? "ConversationBox" : "");
    };
    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateData = new FormData();

        Object.keys(formData).forEach((key) => {
            updateData.append(key, formData[key]);
        });

        if (profileImage) {
            updateData.append("profileImage", profileImage);
        }

        if (Object.keys(formData).length > 0 || profileImage) {
            try {
                const response = await axios.patch(updateUserUrl, updateData, {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                });

                console.log(response.data.user);
                dispatch(
                    setUser({
                        ...response.data.user,
                        userCreatedGroups: user.userCreatedGroups, // Persist existing groups
                    }),
                );
                setMiddleComponent("chatList");
                setRightComponent(receiver ? "ConversationBox" : "");
                setMainViewForMobile("menuScreen");
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    return (
        <div
            className="flex items-start justify-start flex-col h-full w-full"
            style={{ backgroundColor: theme.secondary }}
        >
            <div className="w-full">
                <main className="w-full">
                    <div>
                        <div
                            className="w-full px-6 pb-10 rounded-lg"
                            style={{ backgroundColor: theme.background }}
                        >
                            <h2
                                className="text-2xl font-bold sm:text-xl"
                                style={{ color: theme.text }}
                            >
                                Public Profile
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className="grid max-w-2xl mx-auto mt-8"
                            >
                                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                    <img
                                        className="object-cover w-40 h-40 p-1 rounded-full "
                                        draggable="false"
                                        style={{
                                            ringColor: theme.primary,
                                            border: `2px solid ${theme.button}`,
                                        }}
                                        src={
                                            profileImage
                                                ? URL.createObjectURL(
                                                      profileImage,
                                                  )
                                                : user?.profileImage
                                        }
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
                                                hover: {
                                                    backgroundColor:
                                                        theme.buttonHover,
                                                },
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
                                                backgroundColor:
                                                    theme.inputBackground,
                                                borderColor: theme.border,
                                                color: theme.text,
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
                                                backgroundColor:
                                                    theme.inputBackground,
                                                borderColor: theme.border,
                                                color: theme.text,
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
                                            className="block w-full text-sm rounded-lg border p-1"
                                            style={{
                                                backgroundColor:
                                                    theme.inputBackground,
                                                borderColor: theme.border,
                                                color: theme.text,
                                            }}
                                            placeholder="Write your bio here..."
                                            defaultValue={user?.about}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={handleBackClick}
                                            className="font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                            style={{
                                                backgroundColor:
                                                    theme.secondary,
                                                color: theme.text,
                                            }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={
                                                Object.keys(formData).length ===
                                                    0 && !profileImage
                                            }
                                            className="font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                            style={{
                                                backgroundColor:
                                                    Object.keys(formData)
                                                        .length === 0 &&
                                                    !profileImage
                                                        ? theme.mutedText
                                                        : theme.button,
                                                color: theme.background,
                                                opacity:
                                                    Object.keys(formData)
                                                        .length === 0 &&
                                                    !profileImage
                                                        ? 0.5
                                                        : 1,
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
