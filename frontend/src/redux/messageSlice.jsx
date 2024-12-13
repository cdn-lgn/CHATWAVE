import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: {}, // Store messages by `chatID`
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const { chatID, messages } = action.payload;
      if (!state.messages[chatID]) {
        state.messages[chatID] = [];
      }
      messages.forEach((message) => {
        state.messages[chatID].push(message);
      });
    },

    resetMessages: (state) => {
      state.messages = {};
      state.currentChatID = null;
    },
    addMessageToChat: (state, action) => {
      // console.log(action.payload)
      if (!state.messages[action.payload?.chatID]) {
        state.messages[action.payload?.chatID] = [];
      }
      state.messages[action.payload?.chatID].push(action.payload);
    },
  },
});

export const { setMessages, resetMessages, addMessageToChat } =
  messagesSlice.actions;

export default messagesSlice.reducer;
