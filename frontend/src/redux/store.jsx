import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authUserReducer from "./authUserSlice";
import chatListReducer from "./chatListSlice";
import messagesReducer from "./messageSlice";


// Configuration for Redux Persist
const persistConfig = {
  key: "root", // Key for the persisted state
  storage, // Storage engine (localStorage in this case)
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, authUserReducer);



const clearStoreMiddleware = store => next => action => {
    const state = store.getState();
    const now = Date.now();
    const twoDaysInMillis = 172800000; // 2 days in milliseconds

    // Check if lastUpdated exists and if it's older than 2 days
    if (state.user.lastUpdated && (now - state.user.lastUpdated > twoDaysInMillis)) {
        store.dispatch(resetUser ()); // Clear user data if older than 2 days
    }

    return next(action);
};



const store = configureStore({
    reducer: { user: persistedReducer,
    chatList: chatListReducer,
    messages: messagesReducer,},
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(clearStoreMiddleware)
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };



