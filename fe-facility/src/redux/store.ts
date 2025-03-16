import { configureStore } from "@reduxjs/toolkit";
import userInfo from "./slices/storeUserSlice";

export const store = configureStore({
  reducer: {
    userInfo,
  },
});
