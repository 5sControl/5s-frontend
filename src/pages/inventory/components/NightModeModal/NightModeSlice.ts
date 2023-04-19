import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
import { getNightTime, setNightTime } from '../../inventoryAPI';
import { NightModeResponse } from './types';

interface nightModalState {
  isOpenNightModal: boolean;
  isLoadingDeleteRequest: boolean;
  errorLoadingDeleteRequest: boolean;
  connectDeleteResponse: { message: string } | null;
  isLoadingGetTime: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nightTime: any;
  errorOfInventoryHistory: boolean;
}

const initialState: nightModalState = {
  isOpenNightModal: false,
  isLoadingDeleteRequest: false,
  connectDeleteResponse: null,
  errorLoadingDeleteRequest: false,
  isLoadingGetTime: false,
  nightTime: false,
  errorOfInventoryHistory: false,
};

export const nightTimeSet = createAsyncThunk(
  'nightTime',
  async (data: { token: string; hostname: string; time: NightModeResponse }) => {
    const response: any = await setNightTime(data.hostname, data.token, data.time);
    if (response.status === 204) {
      return { mesasge: 'Item deleted success' };
    }
    return null;
  }
);

export const nightTimeGet = createAsyncThunk(
  'nightTimeGet',
  async (data: { token: string; hostname: string }) => {
    const response: any = await getNightTime(data.hostname, data.token);
    if (response.status === 204) {
      return { mesasge: 'Item deleted success' };
    }
    // console.log(response);
    return response.data[response.data.length - 1];
  }
);

const nightModalSlice = createSlice({
  name: 'nightTimeModal',
  initialState,
  reducers: {
    setIsOpenNightModal(state, action: PayloadAction<boolean>) {
      state.isOpenNightModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(nightTimeSet.pending, (state) => {
      state.isLoadingDeleteRequest = true;
    });
    builder.addCase(nightTimeSet.fulfilled, (state, action) => {
      state.isLoadingDeleteRequest = false;
      state.connectDeleteResponse = action.payload as any;
    });
    builder.addCase(nightTimeSet.rejected, (state) => {
      state.isLoadingDeleteRequest = false;
      state.errorLoadingDeleteRequest = true;
    });

    builder.addCase(nightTimeGet.pending, (state) => {
      state.isLoadingGetTime = true;
    });
    builder.addCase(nightTimeGet.fulfilled, (state, action) => {
      state.isLoadingGetTime = false;
      state.nightTime = action.payload;
    });
    builder.addCase(nightTimeGet.rejected, (state) => {
      state.isLoadingGetTime = false;
      state.errorOfInventoryHistory = true;
    });
  },
});

export const { setIsOpenNightModal } = nightModalSlice.actions;
export const selectNightInventoryModal = (state: RootState) => state.NightModeSlice;
export default nightModalSlice.reducer;
