import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck,faClock } from "@fortawesome/free-solid-svg-icons";


const ImageBox = ({ message, theme, receiver, waite }) => {
    const user = useSelector((state) => state.user.user);
  const isUser = message?.sender?._id == user._id;
  const imageUrl = message?.content?.message;  // Assuming imageUrl is stored in message.content.message

  // console.log(message)

  const handlePdfClick = () => {
    if (imageUrl) {
      window.open(imageUrl, "_blank");
    }
  };
  
  return (
    <div
      className={`flex items-start mb-4 ${isUser ? "justify-end" : "justify-start"} cursor-pointer`}

      onClick={handlePdfClick}
    >
      {/* If the sender is not the user, display receiver's profile image */}
      {!isUser && (
        <img
          src={message?.isGroupMessage ? message?.sender?.profileImage : receiver?.participant?.profileImage}
          alt="Friend Avatar"
          className="w-8 h-8 rounded-full mr-2 cursor-pointer"
        />
      )}

      {/* Image container */}
      <div className={`relative w-1/2 md:w-1/3 flex items-start justify-center flex-col ${isUser ? "ml-auto" : "mr-auto"}`}>
      {!isUser && message.isGroupMessage && (
          <p className="text-sm font-semibold text-gray-500 mb-1">
            {message?.sender?.name}
          </p>
        )}
        <img
          src={message?.content?.message}
          alt="Shared Content"
          className="rounded-lg shadow-md border-2"
          style = {{borderColor:theme.button}}
        />
      {/* If the message is from the user, display the status icon */}
      {isUser && (<div className="">
        <FontAwesomeIcon icon={waite ? faClock : faCheck} className="absolute w-[12px] h-[12px] bottom-1 right-1 rounded-full" style={{backgroundColor:theme.background}}  />
        </div>
        )}
      </div>

    </div>
  );
};

export default ImageBox;
