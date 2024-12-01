import { faBell, faGear, faMessage, faPhone, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userContext } from '../context/userContext';
import LogOutUser from './LogOutUser';


const Navbar = () => {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch()
    const { theme } = useContext(userContext);

    const handleLogout = async () => {
        try {
            const result = await LogOutUser(dispatch);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className='flex items-center justify-center h-full rounded-r-xl' style={{ backgroundColor: theme.background }}>
            <div className='h-full flex items-center justify-between flex-col p-1'>
                {/* User Profile Image and Notification Icon */}
                <div className='flex flex-col gap-1 items-center mb-4'>
                    <div className='w-11 h-11 rounded-full overflow-hidden cursor-pointer'>
                        <img src={user?.profileImage} alt="User  Profile" className='w-full h-full object-cover' />
                    </div>
                    <FontAwesomeIcon icon={faBell} className='text-xl mt-2 cursor-pointer' style={{ color: theme.primary }} />
                </div>

                {/* Message and Phone Icons */}
                <div className='flex flex-col gap-1 items-center mb-4'>
                    <FontAwesomeIcon icon={faMessage} className='text-xl mb-2 cursor-pointer' style={{ color: theme.primary }} />
                    <FontAwesomeIcon icon={faPhone} className='text-xl cursor-pointer' style={{ color: theme.primary }} />
                </div>

                {/* Settings and Logout Icons */}
                <div className='flex flex-col gap-1 items-center'>
                    <FontAwesomeIcon icon={faGear} className='text-xl mb-2 cursor-pointer' style={{ color: theme.primary }} />
                    <FontAwesomeIcon 
                        icon={faRightFromBracket} 
                        className='text-xl cursor-pointer' 
                        style={{ color: theme.primary }} 
                        onClick={handleLogout} // Call the handleLogout function on click
                    />
                </div>
            </div>
        </div>
    );
}

export default Navbar;