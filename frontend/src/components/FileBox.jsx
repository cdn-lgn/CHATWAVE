import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const FileBox = ({ message, theme, receiver, waite }) => {
  const user = useSelector((state) => state.user.user);
  const isUser = message?.sender?._id == user._id;
  const pdfUrl = message?.content?.message;  // Assuming pdfUrl is stored in message.content.message

  // Handle click event to open PDF in a new tab
  const handlePdfClick = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <div
      className={`flex items-start mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* If the sender is not the user, display receiver's profile image */}
      {!isUser && (
        <img
          src={message?.isGroupMessage ? message?.sender?.profileImage : receiver?.participant?.profileImage}
          alt="Friend Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      <div
        className={`relative w-2/3 md:w-1/2 flex items-start justify-center rounded-lg flex-col`}
      >
      {!isUser && message.isGroupMessage && (
          <p className="text-sm font-semibold text-gray-500 mb-1">
            {message?.sender?.name}
          </p>
        )}
        <div className="flex items-center justify-center w-full p-2 gap-2 rounded-lg border-2"
        style={{ borderColor: theme.button }}>
          <FontAwesomeIcon
            icon={faFilePdf}
            style={{
              backgroundColor: theme.button,
              color: "#FFFFFF",
            }}
            className="p-3 w-6 h-6 rounded-full"
          />
          
          {/* Clickable area */}
          <div 
            className="flex flex-col items-start justify-start w-full overflow-hidden cursor-pointer"
            onClick={handlePdfClick} // Attach the click handler here
          >
            <p className="w-full whitespace-nowrap overflow-hidden text-ellipsis -mb-1">
              {message.content.name}
            </p>
            <p className="text-sm" style={{ color: theme.buttonHover }}>
              pdf
            </p>
          </div>
        </div>

        {/* Message status icons */}
        {isUser && (
          <div className="">
            <FontAwesomeIcon
              icon={waite ? faClock : faCheck}
              className="absolute w-[12px] h-[12px] bottom-1 right-1 rounded-full"
              style={{ backgroundColor: theme.background }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileBox;
