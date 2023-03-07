import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

export interface ReportState {
  currentReport: any;
}

const initialState: ReportState = {
  currentReport: false,
};

const currentReport = createSlice({
  name: 'currentReport',
  initialState,
  reducers: {
    addCurrentReport(state, action) {
      state.currentReport = action.payload;
    },
  },
});

export const { addCurrentReport } = currentReport.actions;
export const selectCurrentReport = (state: RootState) => state.currentReport;
export default currentReport.reducer;
