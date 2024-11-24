import { configureStore } from "@reduxjs/toolkit";
import authUserReducer from "./authUserSlice";

const store = configureStore({
  reducer: { user: authUserReducer },
});

export default store;
