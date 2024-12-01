import axios from 'axios';
import { resetUser } from '../redux/authUserSlice';

const logOutUrl = import.meta.env.VITE_USER_API;

const LogOutUser  = async (dispatch) => {
    try {
        const response = await axios.post(`${logOutUrl}/logout`, {}, { withCredentials: true });
        dispatch(resetUser()); // Dispatch the resetUser  action
        console.log(response.data);
        return response.data; // Return response data for further handling
    } catch (error) {
        console.error("Logout failed:", error.message); // Log the error message
        throw error; 
    }
};

export default LogOutUser ;