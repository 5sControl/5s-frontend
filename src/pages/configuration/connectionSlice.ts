import { getConnectionsToDatabases } from './configurationAPI';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export type DatabaseInfo = {
  database_type: string;
  database: string;
  server: string;
  username: string;
};

type DataBaseResponse = {
  count: number;
  next: number;
  previous: number;
  results: Array<DatabaseInfo>;
};

interface ConnectionState {
  databases: DataBaseResponse | null;
  isLoadingGetConnectionsToDB: boolean;
  errorOfGetConnections: boolean;
}

const initialState: ConnectionState = {
  databases: null,
  isLoadingGetConnectionsToDB: false,
  errorOfGetConnections: false,
};

export const getConnectionsToDB = createAsyncThunk(
  'getConnectionsToDB',
  async (data: { token: string; hostname: string }) => {
    const response = await getConnectionsToDatabases(data.hostname, data.token);

    console.log('getConnectionsToDB', response.data);

    return response.data;
  }
);

const connectionSlice = createSlice({
  name: 'connectionPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getConnectionsToDB.pending, (state) => {
      state.isLoadingGetConnectionsToDB = true;
    });
    builder.addCase(getConnectionsToDB.fulfilled, (state, action) => {
      state.isLoadingGetConnectionsToDB = false;
      state.databases = action.payload;
    });
    builder.addCase(getConnectionsToDB.rejected, (state) => {
      state.isLoadingGetConnectionsToDB = false;
      state.errorOfGetConnections = true;
    });
  },
});

export const selectConnectionPage = (state: RootState) => state.connectionPage;
export default connectionSlice.reducer;
