import { createSlice } from "@reduxjs/toolkit";

const initialState ={
chatList:[],}

const chatListSlice = createSlice({
	name:"chatList",
	initialState,
reducers:{
	setChatList:(state,action)=>{
		state.chatList=action.payload
	},
	resetChatList:(state)=>{
		state.chatList=[]
	}
}
})

export const {setChatList,resetChatList}=chatListSlice.actions

export default chatListSlice.reducer