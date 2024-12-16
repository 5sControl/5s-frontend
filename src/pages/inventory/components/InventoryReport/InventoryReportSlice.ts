import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";

interface ReportState {
  statusSort: boolean;
}

const initialState: ReportState = {
  statusSort: false,
};

const inventoryReport = createSlice({
  name: "inventoryReport",
  initialState,
  reducers: {
    setStatusSort(state, action: PayloadAction<boolean>) {
      state.statusSort = action.payload;
    },
  },
});

export const { setStatusSort } = inventoryReport.actions;
export const selectStatusSort = (state: RootState) =>
  state.inventoryReportState;
export default inventoryReport.reducer;
