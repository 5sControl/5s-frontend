import { createSlice } from "@reduxjs/toolkit";

const reportDateSlice = createSlice({
  name: 'reportDate',
  initialState: {
    startDate: '',
    endDate: '',
  },
  reducers: {
    setReportDate(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setStartReportDate(state, action) {
      state.startDate = action.payload;
    },
    setEndReportDate(state, action) {
      state.endDate = action.payload;
    },
  },
});

export const { setReportDate, setStartReportDate, setEndReportDate } = reportDateSlice.actions;
export default reportDateSlice.reducer;