import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getInventoryItemHistory, getInventoryItems } from './inventoryAPI';
import { getSelectedCameras } from '../../api/cameraRequest';
import { Camera, InventoryHistory, InventoryItem } from './types';

interface Inventory {
  isLoading: boolean;
  errorOfInventoryItems: boolean;
  inventoryItems: null | Array<InventoryItem>;
  isLoadingHistory: boolean;
  inventoryHistoryData: Array<InventoryHistory> | null;
  errorOfInventoryHistory: boolean;
  isLoadingCameras: boolean;
  camerasData: Array<{ id: string; text: string }> | null;
  errorOfgetCameras: boolean;
}

const initialState: Inventory = {
  isLoading: false,
  inventoryItems: null,
  errorOfInventoryItems: false,
  isLoadingHistory: false,
  inventoryHistoryData: null,
  errorOfInventoryHistory: false,
  isLoadingCameras: false,
  camerasData: null,
  errorOfgetCameras: false,
};

export const getInventoryItemsAsync = createAsyncThunk(
  'getInventoryItems',
  async (data: { token: string; hostname: string; isSort: boolean }) => {
    const response: any = await getInventoryItems(data.hostname, data.token, data.isSort);
    if (response.data) {
      return response.data.results;
    }
    return null;
  }
);

export const getInventoryItemHistoryAsync = createAsyncThunk(
  'getInventoryHistory',
  async (data: { token: string; hostname: string; params: { itemId: number; date: string } }) => {
    const response: any = await getInventoryItemHistory(data.hostname, data.token, data.params);
    if (response.data) {
      return response.data;
    }
    return null;
  }
);

export const getCamerasAsync = createAsyncThunk(
  'getCameras',
  async (data: { token: string; hostname: string }) => {
    const response = await getSelectedCameras(data.hostname, data.token);
    if (response.data) {
      console.log(response.data);

      const cameras = response.data.map((item: Camera) => {
        return { text: item.name, id: item.id };
      });
      return cameras;
    }
    return null;
  }
);
const inventoryPage = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
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
    builder.addCase(getCamerasAsync.pending, (state) => {
      state.isLoadingCameras = true;
    });
    builder.addCase(getCamerasAsync.fulfilled, (state, action) => {
      state.isLoadingCameras = false;
      state.camerasData = action.payload;
    });
    builder.addCase(getCamerasAsync.rejected, (state) => {
      state.isLoadingCameras = false;
      state.errorOfgetCameras = true;
    });
  },
});

export const selectInventory = (state: RootState) => state.inventory;
export default inventoryPage.reducer;
