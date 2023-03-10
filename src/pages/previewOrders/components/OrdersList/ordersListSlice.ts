import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

interface ReportState {
  activeOrder: null | number;
}

const initialState: ReportState = {
  activeOrder: null,
};

const ordersList = createSlice({
  name: 'ordersList',
  initialState,
  reducers: {
    addActiveOrder(state, action) {
      state.activeOrder = action.payload;
    },
  },
});

export const { addActiveOrder } = ordersList.actions;
export const selectActiveOrder = (state: RootState) => state.activeOrder;
export default ordersList.reducer;
