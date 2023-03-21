import { getConnectionsToDatabases } from './configurationAPI';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

type DataBaseResponse = {
  count: number;
  next: any;
  previous: any;
  results: Array<{ database_type: string; database: string; server: string }>;
};

interface ConnectionState {
  databases: DataBaseResponse | null;
  isLoadingConnectionsToDB: boolean;
  errorOfGetConnections: boolean;
}

const initialState: ConnectionState = {
  databases: null,
  isLoadingConnectionsToDB: false,
  errorOfGetConnections: false,
};

export const getConnectionsToDB = createAsyncThunk(
  'getConnectionsToDB',
  async (data: { token: string; hostname: string }) => {
    const response = await getConnectionsToDatabases(data.hostname, data.token);

    return response.data;
  }
);

const connectionSlice = createSlice({
  name: 'connectionPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getConnectionsToDB.pending, (state) => {
      state.isLoadingConnectionsToDB = true;
    });
    builder.addCase(getConnectionsToDB.fulfilled, (state, action) => {
      state.isLoadingConnectionsToDB = false;
      state.databases = action.payload;
    });
    builder.addCase(getConnectionsToDB.rejected, (state) => {
      state.isLoadingConnectionsToDB = false;
      state.errorOfGetConnections = true;
    });
  },
});

export const selectConnectionPage = (state: RootState) => state.connectionPage;
export default connectionSlice.reducer;
