import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem } from '../../../../storage/inventory';
import { RootState } from '../../../../store';
import { editInventoryItemAxios, setInventoryItem } from '../../inventoryAPI';
import { AddInventoryData } from './types';

interface addInventoryModalState {
  isLoadingAddData: boolean;
  errorLoadingAddData: boolean;
  connectResponseDataAdd: {
    message: {
      detail: string;
    };
    success: boolean;
  } | null;
}

const initialState: addInventoryModalState = {
  isLoadingAddData: false,
  connectResponseDataAdd: null,
  errorLoadingAddData: false,
};

export const addItem = createAsyncThunk(
  'addItem',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (data: { token: string; hostname: string; body: any }) => {
    const response = await setInventoryItem(data.hostname, data.token, data.body);
    return response.data;
  }
);

const addInventoryModalSlice = createSlice({
  name: 'addInventoryModal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addItem.pending, (state) => {
      state.isLoadingAddData = true;
    });
    builder.addCase(addItem.fulfilled, (state, action) => {
      state.isLoadingAddData = false;
      state.connectResponseDataAdd = action.payload;
    });
    builder.addCase(addItem.rejected, (state) => {
      state.isLoadingAddData = false;
      state.errorLoadingAddData = true;
    });
  },
});

export const selectAddInventoryModal = (state: RootState) => state.addInventoryModal;
export default addInventoryModalSlice.reducer;
