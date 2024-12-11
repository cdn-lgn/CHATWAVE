import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChatId: null, // Track the current selected chat
  messages: {}, // Store messages by `chatId`
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.currentChatId = chatId;
      state.messages[chatId] = messages;
    },
    resetMessages: (state) => {
      state.messages = {};
      state.currentChatId = null;
    },
    addMessageToChat: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
  },
});

export const { setMessages, resetMessages, addMessageToChat } =
  messagesSlice.actions;

export default messagesSlice.reducer;
