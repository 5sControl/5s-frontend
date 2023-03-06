import { createSlice } from '@reduxjs/toolkit';

const currentReport = createSlice({
  name: 'currentReport',
  initialState: {
    report: false,
  },
  reducers: {
    addCurrentReport(state, action) {
      state.report = action.payload;
    },
  },
});

export const { addCurrentReport } = currentReport.actions;
export default currentReport.reducer;
