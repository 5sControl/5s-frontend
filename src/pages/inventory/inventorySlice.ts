import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getInventoryItemHistory, getInventoryItems } from './inventoryAPI';
import { InventoryItem } from '../../storage/inventory';

interface Inventory {
  isLoading: boolean;
  errorOfInventoryItems: boolean;
  inventoryItems: null | Array<InventoryItem>;
  isLoadingHistory: boolean;
  inventoryHistoryData: any;
  errorOfInventoryHistory: boolean;
}

const initialState: Inventory = {
  isLoading: false,
  inventoryItems: null,
  errorOfInventoryItems: false,
  isLoadingHistory: false,
  inventoryHistoryData: null,
  errorOfInventoryHistory: false,
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

export const getInventoryItemHistoryAsync = createAsyncThunk(
  'getInventoryHistory',
  async (data: { token: string; hostname: string; params: { camera: string; date: string } }) => {
    const response = await getInventoryItemHistory(data.hostname, data.token, data.params);
    console.log('responce', response);
    if (response.data) {
      return response.data;
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
    builder.addCase(getInventoryItemHistoryAsync.pending, (state) => {
      state.isLoadingHistory = true;
    });
    builder.addCase(getInventoryItemHistoryAsync.fulfilled, (state, action) => {
      state.isLoadingHistory = false;
      state.inventoryHistoryData = action.payload;
    });
    builder.addCase(getInventoryItemHistoryAsync.rejected, (state) => {
      state.isLoadingHistory = false;
      state.errorOfInventoryHistory = true;
    });
  },
});

export const { setIsError } = inventoryPage.actions;
export const selectInventory = (state: RootState) => state.inventory;
export default inventoryPage.reducer;
