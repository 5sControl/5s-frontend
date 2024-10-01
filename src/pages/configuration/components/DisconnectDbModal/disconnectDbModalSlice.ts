import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
import { disconnectDbAPI } from './disconnectDbModalAPI';
import { DatabaseInfo } from '../../types';

type DisconnectResponseStatus = number;

interface ConnectToDbModalState {
  connectionToDisconnectData: DatabaseInfo | null;
  isLoadingDisconnectDb: boolean;
  errorLoadingDisconnectDb: boolean;
  disconnectDbResponse: DisconnectResponseStatus | null;
}

const initialState: ConnectToDbModalState = {
  connectionToDisconnectData: null,
  disconnectDbResponse: null,
  isLoadingDisconnectDb: false,
  errorLoadingDisconnectDb: false,
};

export const disconnectDb = createAsyncThunk(
  'disconnectDB',
  async (data: { token: string; hostname: string; id: number }) => {
    const response = await disconnectDbAPI(data.hostname, data.token, data.id);
    return response.status;
  }
);

const connectToDbModalSlice = createSlice({
  name: 'disconnectDbModal',
  initialState,
  reducers: {
    setConnectionToDisconnectData(
      state,
      action: PayloadAction<DatabaseInfo | null>
    ) {
      state.connectionToDisconnectData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(disconnectDb.pending, (state) => {
      state.isLoadingDisconnectDb = true;
    });
    builder.addCase(
      disconnectDb.fulfilled,
      (state, action: PayloadAction<DisconnectResponseStatus>) => {
        state.isLoadingDisconnectDb = false;
        state.disconnectDbResponse = action.payload;
      }
    );
    builder.addCase(disconnectDb.rejected, (state) => {
      state.isLoadingDisconnectDb = false;
      state.errorLoadingDisconnectDb = true;
    });
  },
});

export const { setConnectionToDisconnectData } = connectToDbModalSlice.actions;
export const selectDisconnectDBModal = (state: RootState) =>
  state.disconnectDBModal;
export default connectToDbModalSlice.reducer;
