import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem } from '../../../../storage/inventory';
import { RootState } from '../../../../store';

interface ReportState {
  activeInventoryItem: null | InventoryItem;
}

const initialState: ReportState = {
  activeInventoryItem: null,
};

const inventoryItemsList = createSlice({
  name: 'inventoryItemList',
  initialState,
  reducers: {
    addActiveInventoryItem(state, action: PayloadAction<InventoryItem>) {
      state.activeInventoryItem = action.payload;
    },
  },
});

export const { addActiveInventoryItem } = inventoryItemsList.actions;
export const selectActiveInventoryItem = (state: RootState) => state.activeInventoryItem;
export default inventoryItemsList.reducer;
