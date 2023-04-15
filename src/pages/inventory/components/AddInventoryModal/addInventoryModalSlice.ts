import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
import { setInventoryItem } from '../../inventoryAPI';
import { AddInventoryDataResponse } from './types';

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
  async (data: { token: string; hostname: string; body: AddInventoryDataResponse }) => {
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
