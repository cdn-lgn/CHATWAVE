import { createSlice } from "@reduxjs/toolkit";

// Initialize an empty object for the initial state
const initialState = {
    user: null, // Assuming user starts off as null
};

const authUserSlice = createSlice({
    name: "user", // Name of the slice
    initialState, // Reference to the initialState variable
    reducers: {
        // Reducer function to set the user
        setUser: (state, action) => {
            state.user = action.payload;
        },
        updateAccountStatus:(state,action)=>{
            state.user.hiddenAccount = action.payload
            console.log("state.user.hiddenAccount",state.user.hiddenAccount)
            console.log("action.payload ",action.payload)
        },
        // Reducer function to reset the user (set it to null)
        resetUser: (state) => {
            state.user = null; // Reset the user to null
            state.lastUpdated=null
        },
    },
});


export const {setUser,resetUser,updateAccountStatus} = authUserSlice.actions

export default authUserSlice.reducer