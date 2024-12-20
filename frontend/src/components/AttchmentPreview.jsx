import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { userContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../context/socketContext";
import { addMessageToChat } from "../redux/messageSlice";
import { updateChat } from "../redux/chatListSlice";

const API_URL = import.meta.env.VITE_USER_API;

const AttachmentPreview = ({ attchment, setAttchment, setDummyMessage }) => {
	const user = useSelector((state) => state.user.user);
	const { theme, receiver } = useContext(userContext);
	const { socket } = useContext(SocketContext);
	const dispatch = useDispatch();
	if (!attchment) return null;
	console.log(attchment);
	const handleClose = () => {
		setAttchment(null);
	};

	const sendFileHandler = async (e) => {
		setDummyMessage({ content : {
      name: attchment.name,  // File name
      type: attchment.type.split("/")[0],  // Determine file type
      message: URL.createObjectURL(attchment)  // URL to access the file
    }});

		let chatID = receiver?.chatID;
		let createdChat;

		const formData = new FormData();

		formData.append("file", attchment);

		formData.append("chatID", chatID);
		formData.append("senderID", user._id);
		formData.append("receiverID", receiver?.participant?._id);
		formData.append("isGroupMessage", receiver?.isGroupChat);
		formData.append("groupID", receiver?.group?._id);

		try {
			const response = await axios.post(
				`${API_URL}/message/createMessage`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
					withCredentials: true,
				},
			);

			// console.log(response.data);
			if (response) {
				setDummyMessage(""); // Clear the dummy message
				setAttchment(null); // Clear the attachment preview

				// Emit the socket event to notify the receiver
				socket.current.emit("send_message", {
					updatedChat: {
						lastMessage: response.data.formattedMessage,
						_id: chatID,
					},
					newMessage: response.data.formattedMessage,
					receiverID: receiver?.participant?._id,
				});
			}
		} catch (error) {
			console.error("Error sending file:", error);
		}
	};

	const previewURL = URL.createObjectURL(attchment);
	useEffect(() => {
		return () => {
			setAttchment(null);
		};
	}, [receiver]);

	return (
		<div
			className="absolute bg-opacity-50 bg-gray-500 w-full h-full flex items-center justify-center z-50 p-3 backdrop-blur-sm"
			onClick={handleClose}
		>
			{attchment.type.includes("image") ? (
				<div>
					<img
						src={previewURL}
						alt="Attchment Preview"
						className="rounded-lg"
					/>
				</div>
			) : attchment.type.includes("audio") ? (
				<div className="audio-container w-full">
					<h3
						style={{ color: theme.text }}
						className="font-bold whitespace-nowrap overflow-hidden text-ellipsis"
					>
						{attchment.name}
					</h3>
					<audio
						controls
						className="audio-player"
						controlsList="nodownload noplaybackrate"
					>
						<source src={previewURL} />
						Your browser does not support the audio element.
					</audio>
				</div>
			) : attchment.type.includes("pdf") ? (
				<div
					className={`w-64 flex items-center justify-between gap-2 rounded-lg p-2 border-2`}
					style={{
						background: theme.background,
						borderColor: theme.button || "#ccc", // Dynamically set border color
					}}
				>
					<FontAwesomeIcon
						icon={faFilePdf}
						style={{
							backgroundColor: theme.button,
							color: "#FFFFFF",
						}}
						className="p-3 w-6 h-6 rounded-full"
					/>
					<p className="whitespace-nowrap overflow-hidden text-ellipsis">
						{attchment.name}
					</p>
				</div>
			) : (
				<div>
					<p>File type not supported for preview.</p>
				</div>
			)}

			<FontAwesomeIcon
				onClick={sendFileHandler}
				icon={faPaperPlane}
				style={{
					backgroundColor: theme.button,
					color: "#FFFFFF",
				}}
				className="absolute bottom-4 right-4 p-3 w-7 h-7 rounded-full cursor-pointer"
			/>
		</div>
	);
};

export default AttachmentPreview;
