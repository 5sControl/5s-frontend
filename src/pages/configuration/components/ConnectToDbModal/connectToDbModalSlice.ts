import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
import { postConnectionWithDbAPI } from './connectToDbModalAPI';
import { ConnectionToDatabaseForm } from './types';

interface ConnectToDbModalState {
  isOpenConnectToDbModal: boolean;
  isLoadingPostConnectionToDb: boolean;
  errorLoadingPostConnectionToDb: boolean;
  connectResponse: {
    message: {
      detail: string;
    };
    success: boolean;
  } | null;
}

const initialState: ConnectToDbModalState = {
  isOpenConnectToDbModal: false,
  isLoadingPostConnectionToDb: false,
  errorLoadingPostConnectionToDb: false,
  connectResponse: null,
};

export const createConnectionWithDB = createAsyncThunk(
  'createConnectionWithDB',
  async (data: { token: string; hostname: string; body: ConnectionToDatabaseForm }) => {
    const response = await postConnectionWithDbAPI(data.hostname, data.token, data.body);

    console.log('createConnectionWithDB', response.data);

    return response.data;
  }
);

const connectToDbModalSlice = createSlice({
  name: 'connectToDbModal',
  initialState,
  reducers: {
    setIsOpenConnectToDbModal(state, action: PayloadAction<boolean>) {
      state.isOpenConnectToDbModal = action.payload;
      state.connectResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createConnectionWithDB.pending, (state) => {
      state.isLoadingPostConnectionToDb = true;
    });
    builder.addCase(createConnectionWithDB.fulfilled, (state, action) => {
      state.isLoadingPostConnectionToDb = false;
      state.connectResponse = action.payload;
    });
    builder.addCase(createConnectionWithDB.rejected, (state) => {
      state.isLoadingPostConnectionToDb = false;
      state.errorLoadingPostConnectionToDb = true;
    });
  },
});

export const { setIsOpenConnectToDbModal } = connectToDbModalSlice.actions;
export const selectConnectToDbModal = (state: RootState) => state.connectToDbModal;
export default connectToDbModalSlice.reducer;
