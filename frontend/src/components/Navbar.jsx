import {
  faBell,
  faGear,
  faMessage,
  faPhone,
  faRightFromBracket,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userContext } from "../context/userContext";
import LogOutUser from "./LogOutUser";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, width, middleComponent, setMiddleComponent } =
    useContext(userContext);

  const settingsHandler = () => {
    navigate("/settings");
  };

  const handleLogout = async () => {
    try {
      const result = await LogOutUser(dispatch);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (width > 768) {
    return (
      <div
        className="flex items-center justify-center h-full rounded-r-xl"
        style={{ backgroundColor: theme.background }}
      >
        <div className="h-full flex items-center justify-between flex-col p-1">
          {/* User Profile Image and Notification Icon */}
          <div className="flex flex-col gap-1 items-center mb-4">
            <div className="w-11 h-11 rounded-full overflow-hidden cursor-pointer">
              <img
                src={user?.profileImage}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <FontAwesomeIcon
              icon={faBell}
              className="text-xl mt-2 cursor-pointer transition-all duration-300"
              style={{ color: theme.primary }}
            />
          </div>

          {/* Message and Phone Icons */}
          <div className="flex flex-col gap-3 items-center mb-4">
            <FontAwesomeIcon
              icon={faMessage}
              className="text-xl cursor-pointer p-3 rounded-full transition-all duration-300"
              style={
                middleComponent === "chatList"
                  ? { background: theme.button, color: theme.background }
                  : { color: theme.primary }
              }
              onClick={() => setMiddleComponent("chatList")}
            />

            {user?.userCreatedGroups !=false && (
              <FontAwesomeIcon
                icon={faUsersGear}
                className="text-xl cursor-pointer p-3 rounded-full transition-all duration-300"
                style={
                  middleComponent === "groupList"
                    ? { background: theme.button, color: theme.background }
                    : { color: theme.primary }
                }
                onClick={() => setMiddleComponent("groupList")}
              />
            )}

            <FontAwesomeIcon
              icon={faPhone}
              className="text-xl cursor-pointer p-3 rounded-full"
              style={
                middleComponent === "callList"
                  ? { background: theme.button, color: theme.background }
                  : { color: theme.primary }
              }
              onClick={() => setMiddleComponent("callList")}
            />
          </div>

          {/* Settings and Logout Icons */}
          <div className="flex flex-col gap-1 items-center">
            <FontAwesomeIcon
              icon={faGear}
              className="text-xl mb-2 cursor-pointer"
              style={{ color: theme.primary }}
              onClick={settingsHandler}
            />
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="text-xl cursor-pointer"
              style={{ color: theme.primary }}
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    );
  }

  if (width <= 768) {
    return (
      <div
        className="flex items-center justify-center w-full rounded-b-xl"
        style={{ backgroundColor: theme.background }}
      >
        <div className="flex w-full px-3 py-2 items-center justify-between">
          <div className="w-11 h-11 rounded-full overflow-hidden cursor-pointer">
            <img
              src={user?.profileImage}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <FontAwesomeIcon
            icon={faBell}
            className="text-xl mt-2 cursor-pointer"
            style={{ color: theme.primary }}
          />
        </div>
      </div>
    );
  }

  // Optional: Return null or a default view if no conditions are met
  return null;
};

const BottomBarForMobile = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, width, middleComponent, setMiddleComponent } =
    useContext(userContext);

  const settingsHandler = () => {
    navigate("/settings");
  };

  const handleLogout = async () => {
    try {
      const result = await LogOutUser(dispatch);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (width <= 768)
    return (
      <div
        className="flex items-center justify-center w-full rounded-r-xl"
        style={{ backgroundColor: theme.background }}
      >
        <div className="w-full flex items-center justify-between px-4 py-1">
          <FontAwesomeIcon
            icon={faMessage}
            className="text-xl cursor-pointer py-3 px-6 rounded-full transition-all duration-300"
            style={
              middleComponent === "chatList"
                ? { background: theme.button, color: theme.background }
                : { color: theme.primary }
            }
            onClick={() => setMiddleComponent("chatList")}
          />
          {user?.userCreatedGroups && (
            <FontAwesomeIcon
              icon={faUsersGear}
              className="text-xl cursor-pointer py-3 px-6 rounded-full transition-all duration-300"
              style={
                middleComponent === "groupList"
                  ? { background: theme.button, color: theme.background }
                  : { color: theme.primary }
              }
              onClick={() => setMiddleComponent("groupList")}
            />
          )}

          <FontAwesomeIcon
            icon={faPhone}
            className="text-xl cursor-pointer py-3 px-6 rounded-full transition-all duration-300"
            style={
              middleComponent === "callList"
                ? { background: theme.button, color: theme.background }
                : { color: theme.primary }
            }
            onClick={() => setMiddleComponent("callList")}
          />

          <FontAwesomeIcon
            icon={faGear}
            className="text-xl mb-2 cursor-pointer"
            style={{ color: theme.primary }}
            onClick={settingsHandler}
          />
        </div>
      </div>
    );
};

export { Navbar, BottomBarForMobile };
