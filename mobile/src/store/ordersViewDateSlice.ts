import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const ordersViewDateSlice = createSlice({
  name: 'ordersViewDate',
  initialState: {
    startDate: moment()
    .set({ hour: 10, minute: 0, second: 0 })
    .startOf('day')
    .format("YYYY-MM-DDTHH:mm:ss"),
  },
  reducers: {
    setStartOrdersViewDate(state, action) {
      console.log('in reducer', action.payload.startDate)
      state.startDate = action.payload.startDate;
    },
  },
});

export const { setStartOrdersViewDate } = ordersViewDateSlice.actions;
export default ordersViewDateSlice.reducer;