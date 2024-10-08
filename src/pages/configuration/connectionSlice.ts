import { getConnectionsToDatabases } from "./configurationAPI";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { DatabaseInfo, DataBaseResponse } from "./types";

interface ConnectionState {
  databases: DataBaseResponse | null;
  isLoadingGetConnectionsToDB: boolean;
  isErrorOfGetConnections: boolean;
  errorMessageFromDb: SerializedError | null;
}

const initialState: ConnectionState = {
  databases: null,
  isLoadingGetConnectionsToDB: false,
  isErrorOfGetConnections: false,
  errorMessageFromDb: null,
};

export const getConnectionsToDB = createAsyncThunk(
  "getConnectionsToDB",
  async (data: { token: string; hostname: string }) => {
    const response = await getConnectionsToDatabases(data.hostname, data.token);
    return response.data;
  }
);

const connectionSlice = createSlice({
  name: "connectionPage",
  initialState,
  reducers: {
    setDatabasesOrdersView(state, action: PayloadAction<DatabaseInfo>) {
      state.databases = {
        count: 1,
        next: null,
        previous: null,
        results: [action.payload],
      };
    },
    clearDatabasesOrdersView(state) {
      state.databases = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConnectionsToDB.pending, (state) => {
      state.isLoadingGetConnectionsToDB = true;
    });
    builder.addCase(getConnectionsToDB.fulfilled, (state, action) => {
      state.isLoadingGetConnectionsToDB = false;
      state.databases = {
        count: action.payload.length,
        next: null,
        previous: null,
        results: action.payload,
      };
    });
    builder.addCase(getConnectionsToDB.rejected, (state, action) => {
      state.isLoadingGetConnectionsToDB = false;
      state.isErrorOfGetConnections = true;
      state.errorMessageFromDb = action.error;
    });
  },
});

export const { setDatabasesOrdersView, clearDatabasesOrdersView } =
  connectionSlice.actions;
export const selectConnectionPage = (state: RootState) => state.connectionPage;
export default connectionSlice.reducer;
