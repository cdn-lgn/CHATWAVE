import React,{useContext} from "react";
import { userContext } from '../context/userContext';
import useFetchMessagesHook from '../hooks/useFetchMessagesHook';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const UserGroupCardForList = ({userOrGroup, theme }) => {

  const {receiver,setReceiver,setMainViewForMobile,setRightComponent} = useContext(userContext)

const clickHandler =()=>{
  setReceiver(userOrGroup)
  setMainViewForMobile("ConversationBox")
  setRightComponent("ConversationBox")

  
}
  return (
    <div
      className="flex items-center gap-4 w-full rounded-lg cursor-pointer"
      style={{background:theme.secondry}}
      onClick={clickHandler}
    >
      {/* Profile Image */}
      <img
        src={userOrGroup.isGroupChat ? userOrGroup?.group?.profileImage : userOrGroup?.participant?.profileImage}
        alt={userOrGroup.isGroupChat ? userOrGroup?.group?.name :userOrGroup?.participant?.name}
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* userOrGroup? Details */}
      <div className="flex-1 min-w-0 relative">
        <div className="flex items-center justify-between">
          <h5 className="font-medium" style={{ color: theme.text }}>
            {userOrGroup.isGroupChat ? userOrGroup?.group?.name : userOrGroup?.participant?.name}
          </h5>
        </div>

        <p
          className="text-sm whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ color: theme.text }}
        >
          {userOrGroup?.lastMessage?.type !="text" ? userOrGroup?.lastMessage?.type : userOrGroup?.lastMessage?.message}
        </p>
      </div>
      {(userOrGroup?.participant?.status === "online" || userOrGroup?.participant?.status === "typing...") && (
  <FontAwesomeIcon icon={faCircle} className="text-green-600 text-xs" />
)}

    </div>
  );
};

export default UserGroupCardForList;
