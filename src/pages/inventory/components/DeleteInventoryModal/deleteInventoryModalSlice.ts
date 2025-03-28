import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { deleteInventoryItemAxios } from "../../inventoryAPI";

interface deleteInventoryModalState {
  isOpenDeleteModal: boolean;
  isLoadingDeleteRequest: boolean;
  errorLoadingDeleteRequest: boolean;
  connectDeleteResponse: { message: string } | null;
  currentDeleteItemId: number | null;
}

const initialState: deleteInventoryModalState = {
  isOpenDeleteModal: false,
  isLoadingDeleteRequest: false,
  connectDeleteResponse: null,
  errorLoadingDeleteRequest: false,
  currentDeleteItemId: null,
};

export const deleteItem = createAsyncThunk(
  "deleteItem",
  async (data: { token: string; hostname: string; id: number }) => {
    const response: any = await deleteInventoryItemAxios(
      data.hostname,
      data.token,
      data.id
    );
    if (response.status === 204) {
      return { mesasge: "Item deleted success" };
    }
    return null;
  }
);

const deleteInventoryModalSlice = createSlice({
  name: "deleteInventoryModal",
  initialState,
  reducers: {
    setIsOpenDeleteModal(state, action: PayloadAction<boolean>) {
      state.isOpenDeleteModal = action.payload;
    },
    setCurrentDeleteItemId(state, action: PayloadAction<number>) {
      state.currentDeleteItemId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteItem.pending, (state) => {
      state.isLoadingDeleteRequest = true;
    });
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      state.isLoadingDeleteRequest = false;
      state.connectDeleteResponse = action.payload as any;
    });
    builder.addCase(deleteItem.rejected, (state) => {
      state.isLoadingDeleteRequest = false;
      state.errorLoadingDeleteRequest = true;
    });
  },
});

export const { setIsOpenDeleteModal, setCurrentDeleteItemId } =
  deleteInventoryModalSlice.actions;
export const selectDeleteInventoryModal = (state: RootState) =>
  state.deleteInventoryModal;
export default deleteInventoryModalSlice.reducer;
