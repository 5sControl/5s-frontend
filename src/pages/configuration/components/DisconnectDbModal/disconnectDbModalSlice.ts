import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
import { disconnectDbAPI } from './disconnectDbModalAPI';

interface ConnectToDbModalState {
  isOpenDisconnectModal: boolean;
  isLoadingDisconnectDb: boolean;
  errorLoadingDisconnectDb: boolean;
}

const initialState: ConnectToDbModalState = {
  isOpenDisconnectModal: false,
  isLoadingDisconnectDb: false,
  errorLoadingDisconnectDb: false,
};

export const disconnectDb = createAsyncThunk(
  'disconnectDB',
  async (data: { token: string; hostname: string; id: number }) => {
    const response = await disconnectDbAPI(data.hostname, data.token, data.id);

    console.log('disconnectDb', response.data);

    return response.data;
  }
);

const connectToDbModalSlice = createSlice({
  name: 'disconnectDbModal',
  initialState,
  reducers: {
    setIsOpenDisconnectModal(state, action: PayloadAction<boolean>) {
      state.isOpenDisconnectModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(disconnectDb.pending, (state) => {
      state.isLoadingDisconnectDb = true;
    });
    builder.addCase(disconnectDb.fulfilled, (state) => {
      state.isLoadingDisconnectDb = false;
    });
    builder.addCase(disconnectDb.rejected, (state) => {
      state.isLoadingDisconnectDb = false;
      state.errorLoadingDisconnectDb = true;
    });
  },
});

export const { setIsOpenDisconnectModal } = connectToDbModalSlice.actions;
export const selectDisconnectDBModal = (state: RootState) => state.disconnectDBModal;
export default connectToDbModalSlice.reducer;
