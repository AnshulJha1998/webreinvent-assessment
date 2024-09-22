import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type USER_STATE = {
  isAuthenticated: boolean;
  token: string | null;
  userData: Record<string, unknown> | null;
};

const initialState: USER_STATE = {
  isAuthenticated: false,
  token: null,
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        userData: Record<string, unknown>;
      }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userData = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
