import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
import { postConnectionWithDbAPI } from './connectToDbModalAPI';
import { ConnectionToDatabaseForm, ConnectResponse } from './types';
import { DatabaseInfo } from '../../types';

interface ConnectToDbModalState {
  connectionType: string | null;
  currentConnectionData: DatabaseInfo | null;
  isLoadingPostConnectionToDb: boolean;
  isErrorLoadingPostConnectionToDb: boolean;
  connectResponse: ConnectResponse | null;
  errorConnectToDbResponse: SerializedError | null;
}

const initialState: ConnectToDbModalState = {
  connectionType: null,
  currentConnectionData: null,
  isLoadingPostConnectionToDb: false,
  isErrorLoadingPostConnectionToDb: false,
  connectResponse: null,
  errorConnectToDbResponse: null,
};

export const createConnectionWithDB = createAsyncThunk(
  'createConnectionWithDB',
  async (data: { token: string; hostname: string; body: any }) => {
    const response = await postConnectionWithDbAPI(
      data.hostname,
      data.token,
      data.body
    );
    return response.data;
  }
);

const connectToDbModalSlice = createSlice({
  name: 'connectToDbModal',
  initialState,
  reducers: {
    setConnectionType(state, action: PayloadAction<string | null>) {
      state.connectionType = action.payload;
      state.connectResponse = null;
    },
    setCurrentConnectionData(
      state,
      action: PayloadAction<DatabaseInfo | null>
    ) {
      state.currentConnectionData = action.payload;
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
      state.connectionType = null;
      state.currentConnectionData = null;
    });
    builder.addCase(createConnectionWithDB.rejected, (state, action) => {
      state.isLoadingPostConnectionToDb = false;
      state.isErrorLoadingPostConnectionToDb = true;
      state.errorConnectToDbResponse = action.error;
    });
  },
});

export const { setConnectionType, setCurrentConnectionData } =
  connectToDbModalSlice.actions;
export const selectConnectToDbModal = (state: RootState) =>
  state.connectToDbModal;
export default connectToDbModalSlice.reducer;
