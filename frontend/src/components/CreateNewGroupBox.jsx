import { useState, useContext } from "react";
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { userContext } from "../context/userContext";

const createGroupUrl = `${import.meta.env.VITE_USER_API}/group/createGroup`;

const CreateNewGroupBox = () => {
	const { theme } = useContext(userContext);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [profileImage, setProfileImage] = useState(null);

	const handlePhotoChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setProfileImage(selectedFile); // Save raw file directly for FormData
		}
	};

	const createGroup = async (e) => {
		e.preventDefault();

		// Prepare FormData
		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("profileImage", profileImage); // Directly append the raw file

		try {
			const response = await axios.post(createGroupUrl, formData, {
				withCredentials: true,
				headers: { "Content-Type": "multipart/form-data" },
			});

			console.log("Group Created:", response.data);
		} catch (error) {
			console.error("Error creating group:", error.message);
		}
	};

	return (
		<div
			className="p-4 rounded-lg shadow-md"
			style={{ backgroundColor: theme.background, color: theme.text }}
		>
			<h2 className="text-xl font-semibold mb-2 text-center">
				Create New Group
			</h2>
			<div className="relative mt-4 mb-4 flex items-center justify-center">
				<label
					htmlFor="profileImage"
					className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden cursor-pointer flex items-center justify-center"
					style={{ backgroundColor: theme.inputBackground }}
				>
					{profileImage ? (
						<img
							src={URL.createObjectURL(profileImage)}
							alt="Profile Preview"
							className="object-cover w-full h-full"
						/>
					) : (
						<FontAwesomeIcon
							icon={faCamera}
							className="text-gray-400 text-2xl"
						/>
					)}
				</label>
				<input
					type="file"
					id="profileImage"
					accept="image/*"
					className="hidden"
					onChange={handlePhotoChange}
				/>
			</div>
			<form onSubmit={createGroup} className="space-y-4">
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium"
						style={{ color: theme.mutedText }}
					>
						Group Name
					</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter group name"
						className="w-full p-3 rounded-lg border"
						style={{
							backgroundColor: theme.inputBackground,
							color: theme.text,
							borderColor: theme.border,
						}}
					/>
				</div>
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium"
						style={{ color: theme.mutedText }}
					>
						Description
					</label>
					<textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Enter group description"
						className="w-full p-3 rounded-lg border"
						rows={3}
						style={{
							backgroundColor: theme.inputBackground,
							color: theme.text,
							borderColor: theme.border,
						}}
					></textarea>
				</div>
				<button
					type="submit"
					className="w-full py-2 rounded-lg text-white"
					style={{ backgroundColor: theme.button }}
				>
					Create Group
				</button>
			</form>
		</div>
	);
};

export default CreateNewGroupBox;
