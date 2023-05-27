import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
import { postConnectionWithDbAPI } from './connectToDbModalAPI';
import { ConnectionToDatabaseForm, ConnectResponse } from './types';

interface ConnectToDbModalState {
  isOpenConnectToDbModal: boolean;
  isLoadingPostConnectionToDb: boolean;
  isErrorLoadingPostConnectionToDb: boolean;
  connectResponse: ConnectResponse | null;
  errorConnectToDbResponse: SerializedError | null;
}

const initialState: ConnectToDbModalState = {
  isOpenConnectToDbModal: false,
  isLoadingPostConnectionToDb: false,
  isErrorLoadingPostConnectionToDb: false,
  connectResponse: null,
  errorConnectToDbResponse: null,
};

export const createConnectionWithDB = createAsyncThunk(
  'createConnectionWithDB',
  async (data: { token: string; hostname: string; body: ConnectionToDatabaseForm }) => {
    const response = await postConnectionWithDbAPI(data.hostname, data.token, data.body);
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
      state.isErrorLoadingPostConnectionToDb = false;
    });
    builder.addCase(createConnectionWithDB.rejected, (state, action) => {
      state.isLoadingPostConnectionToDb = false;
      state.isErrorLoadingPostConnectionToDb = true;
      state.errorConnectToDbResponse = action.error;
    });
  },
});

export const { setIsOpenConnectToDbModal } = connectToDbModalSlice.actions;
export const selectConnectToDbModal = (state: RootState) => state.connectToDbModal;
export default connectToDbModalSlice.reducer;
