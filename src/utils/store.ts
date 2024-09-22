import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import allUsersSlice from "./slices/allUsersSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    getAllUsers: allUsersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
