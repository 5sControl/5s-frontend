import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
import { editInventoryItemAxios } from '../../inventoryAPI';
import { InventoryItem } from '../../types';
import { EditInventoryData, EditInventoryDataResponse } from './types';

interface editInventoryModalState {
  isOpenEditModal: boolean;
  currentEditItem: null | InventoryItem;
  isLoadingEditData: boolean;
  errorLoadingEditData: boolean;
  connectResponse: {
    message: {
      detail: string;
    };
    success: boolean;
  } | null;
}

const initialState: editInventoryModalState = {
  isOpenEditModal: false,
  currentEditItem: null,
  isLoadingEditData: false,
  connectResponse: null,
  errorLoadingEditData: false,
};

export const editItem = createAsyncThunk(
  'editItem',
  async (data: {
    token: string;
    hostname: string;
    body: EditInventoryDataResponse;
  }) => {
    const response = await editInventoryItemAxios(
      data.hostname,
      data.token,
      data.body
    );
    return response.data;
  }
);

const editInventoryModalSlice = createSlice({
  name: 'editInventoryModal',
  initialState,
  reducers: {
    setIsOpenEditModal(state, action: PayloadAction<boolean>) {
      state.isOpenEditModal = action.payload;
    },
    setCurrentEditItem(state, action: PayloadAction<InventoryItem>) {
      state.currentEditItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editItem.pending, (state) => {
      state.isLoadingEditData = true;
    });
    builder.addCase(editItem.fulfilled, (state, action) => {
      state.isLoadingEditData = false;
      state.connectResponse = action.payload;
    });
    builder.addCase(editItem.rejected, (state) => {
      state.isLoadingEditData = false;
      state.errorLoadingEditData = true;
    });
  },
});

export const { setIsOpenEditModal, setCurrentEditItem } =
  editInventoryModalSlice.actions;
export const selectEditInventoryModal = (state: RootState) =>
  state.editInventoryModal;
export default editInventoryModalSlice.reducer;
