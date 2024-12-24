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
            const { _id } = action.payload;
            if (state.chatList[_id]) {
            // console.log(action.payload)
                state.chatList[_id].lastMessage = action.payload?.lastMessage;
            } else {
                state.chatList[_id] = action.payload;
            }
        },
        updateParticipantStatus: (state, action) => {
            const { userID, status } = action.payload;
            Object.keys(state.chatList).forEach((chatID) => {
                const chat = state.chatList[chatID];
                if (chat.participant?._id === userID) {
                    chat.participant.status = status;
                }
            });
        },
        updateParticipantTypingStatus:(state,action)=>{
            // console.log(action.payload)
            const {chatID,receiverID,status} = action.payload 
            state.chatList[chatID].participant.status = status 
        }
    },
});

export const {
    setChatList,
    resetChatList,
    updateChat,
    updateParticipantStatus,
    updateParticipantTypingStatus,
} = chatListSlice.actions;

export default chatListSlice.reducer;
