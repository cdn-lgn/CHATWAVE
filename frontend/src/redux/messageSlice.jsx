import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChatID: null, // Track the current selected chat
  messages: {}, // Store messages by `chatID`
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const { chatID, content } = action.payload;
      state.currentChatID = chatID;
      state.messages[chatID] = {chat,content};
    },
    resetMessages: (state) => {
      state.messages = {};
      state.currentChatID = null;
    },
    addMessageToChat: (state, action) => {
      // console.log(action.payload)
      const { chat, content } = action.payload;
      if (!state.messages[chat.chatID]) {
        state.messages[chat.chatID] = [];
      }
      state.messages[chat.chatID].push({chat,content});
    },
  },
});

export const { setMessages, resetMessages, addMessageToChat } =
  messagesSlice.actions;

export default messagesSlice.reducer;
