import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

interface ReportState {
  activeOrder: null | string;
}

const initialState: ReportState = {
  activeOrder: null,
};

const ordersList = createSlice({
  name: 'ordersList',
  initialState,
  reducers: {
    addActiveOrder(state, action: PayloadAction<number>) {
      state.activeOrder = action.payload;
    },
  },
});

export const { addActiveOrder } = ordersList.actions;
export const selectActiveOrder = (state: RootState) => state.activeOrder;
export default ordersList.reducer;
