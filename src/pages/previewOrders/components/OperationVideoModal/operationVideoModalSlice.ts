import { OperationItem } from './../../../../storage/orderView';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

export type VideoStateOperationModal = {
  time: number;
  playing: boolean;
  volume: number;
  controls: boolean;
  url: string;
};

interface OperationVideoModalState {
  videoState: VideoStateOperationModal;
  isOpenOperationVideoModal: boolean;
}

const initialState: OperationVideoModalState = {
  videoState: { time: 0, playing: true, volume: 0.9, controls: true, url: '' },
  isOpenOperationVideoModal: false,
};

const operationVideoModalSlice = createSlice({
  name: 'operationVideoModal',
  initialState,
  reducers: {
    setIsOpenOperationVideoModal(state, action: PayloadAction<boolean>) {
      state.isOpenOperationVideoModal = action.payload;
    },
    setTimeOperationVideoModal(state, action: PayloadAction<OperationItem>) {
      const dateObj = new Date(action.payload.operationTime);
      const outputStr = dateObj.toISOString().replace('T', ' ').slice(0, -1);
      const reportTime =
        Date.parse(action.payload.operationTime) - action.payload.video_data.date_start;

      state.videoState.time = reportTime;
      state.videoState.url = `http://192.168.1.110:3456/video?time=${outputStr}&camera_ip=192.168.1.169#t=${reportTime}`;
    },
    setUrlOperationVideoModal(state, action: PayloadAction<string>) {
      state.videoState.url = action.payload;
    },
  },
});

export const {
  setIsOpenOperationVideoModal,
  setTimeOperationVideoModal,
  setUrlOperationVideoModal,
} = operationVideoModalSlice.actions;
export const selectOperationVideoModal = (state: RootState) => state.operationVideoModal;
export default operationVideoModalSlice.reducer;
