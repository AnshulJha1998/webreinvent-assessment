import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { httpService } from "../services";
import { GET_USER_URL } from "../endpoints";

type SINGLE_USER_TYPE = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

type RESPONSE_TYPE = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: SINGLE_USER_TYPE[];
  support: {
    url: string;
    text: string;
  };
};

type USERS_DATA_STATE = {
  allUsers: SINGLE_USER_TYPE[];
  loading: boolean;
  error: string | null;
};

const initialState: USERS_DATA_STATE = {
  allUsers: [] as SINGLE_USER_TYPE[],
  loading: false,
  error: null,
};

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async () => {
    const [response1, response2] = await Promise.all([
      httpService<RESPONSE_TYPE>(GET_USER_URL),
      httpService<RESPONSE_TYPE>(`${GET_USER_URL}?page=2`),
    ]);

    const combinedData = [...response1.data, ...response2.data];

    return combinedData;
  }
);

const allUsersSlice = createSlice({
  name: "getAllUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export default allUsersSlice.reducer;
