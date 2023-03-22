import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getInventoryItems } from './inventoryAPI';
import { InventoryItem } from '../../storage/inventory';

interface Inventory {
  isLoading: boolean;
  errorOfInventoryItems: boolean;
  inventoryItems: null | Array<InventoryItem>;
}

const initialState: Inventory = {
  isLoading: false,
  inventoryItems: null,
  errorOfInventoryItems: false,
};

export const getInventoryItemsAsync = createAsyncThunk(
  'getInventoryItems',
  async (data: { token: string; hostname: string }) => {
    const response = await getInventoryItems(data.hostname, data.token);
    if (response.data) {
      return response.data.results;
    }
    return null;
  }
);

const inventoryPage = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setIsError: (state, action) => {
      state.errorOfInventoryItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInventoryItemsAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getInventoryItemsAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.inventoryItems = action.payload;
    });
    builder.addCase(getInventoryItemsAsync.rejected, (state) => {
      state.isLoading = false;
      state.errorOfInventoryItems = true;
    });
  },
});

export const { setIsError } = inventoryPage.actions;
export const selectInventory = (state: RootState) => state.inventory;
export default inventoryPage.reducer;
