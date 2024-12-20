import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck,faClock } from "@fortawesome/free-solid-svg-icons";


const ImageBox = ({ message, theme, receiver, waite }) => {
    const user = useSelector((state) => state.user.user);
  const isUser = message?.sender?._id == user._id;
  // console.log(message)
  
  return (
    <div
      className={`flex items-start mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* If the sender is not the user, display receiver's profile image */}
      {!isUser && (
        <img
          src={!message?.isGroupMessage && receiver?.participant?.profileImage}
          alt="Friend Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      {/* Image container */}
      <div className={`relative w-1/2 flex items-center justify-center ${isUser ? "ml-auto" : "mr-auto"}`}>
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
