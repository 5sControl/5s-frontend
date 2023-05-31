import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { getCompanyVersionAPI } from './infoAPI';
import { VersionInfoType } from './types';

interface InfoPageState {
  isLoadingCompanyVersions: boolean;
  isErrorCompanyVersions: boolean;
  version: Array<VersionInfoType>;
}

const initialState: InfoPageState = {
  isLoadingCompanyVersions: false,
  isErrorCompanyVersions: false,
  version: [],
};

export const getCompanyVersionAsync = createAsyncThunk(
  'getCompanyVersion',
  async (data: { token: string; hostname: string }) => {
    const response = await getCompanyVersionAPI(data.hostname, data.token);

    if (response.data) {
      return response.data;
    }

    return [];
  }
);

const infoPage = createSlice({
  name: 'infoPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanyVersionAsync.pending, (state) => {
      state.isLoadingCompanyVersions = true;
    });
    builder.addCase(getCompanyVersionAsync.fulfilled, (state, action) => {
      state.isLoadingCompanyVersions = false;
      state.version = action.payload;
    });
    builder.addCase(getCompanyVersionAsync.rejected, (state) => {
      state.isLoadingCompanyVersions = false;
      state.isErrorCompanyVersions = true;
    });
  },
});

export const selectInfoPage = (state: RootState) => state.infoPage;
export default infoPage.reducer;
