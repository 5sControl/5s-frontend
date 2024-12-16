import { createSlice } from "@reduxjs/toolkit";

const cookies = createSlice({
  name: "cookies",
  initialState: {
    report: false,
  },
  reducers: {
    setToken(state, action) {
      state.report = action.payload;
    },
    deleteToken(state, action) {
      state.report = action.payload;
    },
  },
});

export const { setToken, deleteToken } = cookies.actions;
export default cookies.reducer;
