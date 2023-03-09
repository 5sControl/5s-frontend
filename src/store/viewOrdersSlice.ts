import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

export interface ReportState {
  activeOrder: null | number;
}

const initialState: ReportState = {
  activeOrder: null,
};

const orders = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addActiveOrder(state, action) {
      state.activeOrder = action.payload;
    },
  },
});

export const { addActiveOrder } = orders.actions;
export const selectActiveOrder = (state: RootState) => state.activeOrder;
export default orders.reducer;
