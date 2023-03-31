import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

interface HistoryState {
  selectDate: string | null;
}

const initialState: HistoryState = {
  selectDate: null,
};

const inventoryHistory = createSlice({
  name: 'inventoryHistory',
  initialState,
  reducers: {
    setInventoryHistoryDate(state, action: PayloadAction<string>) {
      state.selectDate = action.payload;
    },
  },
});

export const { setInventoryHistoryDate } = inventoryHistory.actions;
export const selectInventoryHistory = (state: RootState) => state.inventoryHistory;
export default inventoryHistory.reducer;
