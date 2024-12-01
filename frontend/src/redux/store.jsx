import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authUserReducer from "./authUserSlice";

// Configuration for Redux Persist
const persistConfig = {
  key: "root", // Key for the persisted state
  storage, // Storage engine (localStorage in this case)
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, authUserReducer);

const store = configureStore({
  reducer: { user: persistedReducer },
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };