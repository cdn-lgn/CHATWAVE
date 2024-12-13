import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatList: {},
};

const chatListSlice = createSlice({
    name: "chatList",
    initialState,
    reducers: {
        setChatList: (state, action) => {
            const chatList = action.payload; 
            chatList.forEach((chat) => {
                state.chatList[chat?._id] = chat; 
            });
        },
        resetChatList: (state) => {
            state.chatList = {};
        },
        updateChat: (state, action) => {
            // console.log(action.payload)
            const { _id } = action.payload;
            if(state.chatList[_id]){
                state.chatList[_id].lastMessage=action.payload?.lastMessage
            }else{
            state.chatList[_id] = action.payload;
            }
        },
    },
});

export const { setChatList, resetChatList, updateChat } = chatListSlice.actions;

export default chatListSlice.reducer;
