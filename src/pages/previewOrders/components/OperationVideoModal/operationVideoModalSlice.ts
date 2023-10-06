import { OperationItem } from './../../../../storage/orderView';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
import type ReactPlayer from 'react-player';

export type VideoStateOperationModal = {
  playing: boolean;
  volume: number;
  controls: boolean;
  url: string;
};

interface OperationVideoModalState {
  playerRef: ReactPlayer | null;
  videoState: VideoStateOperationModal;
  isOpenOperationVideoModal: boolean;
}

const initialState: OperationVideoModalState = {
  playerRef: null,
  videoState: { playing: true, volume: 0.9, controls: true, url: '' },
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
      const cameraIp = action.payload.video_data?.camera_ip || window.location.hostname;
      const outputStr = dateObj.toISOString().replace('T', ' ').slice(0, -1);
      const reportTime =
        Date.parse(action.payload.operationTime) - action.payload.video_data.date_start;
      const reportTimeDate = new Date(reportTime);
      const minutes = reportTimeDate.getMinutes();
      const sec = reportTimeDate.getSeconds();
      const timeAction = minutes * 60 + sec;

      state.playerRef?.seekTo(timeAction);
      state.videoState.url = `${process.env.REACT_APP_NGROK}api/onvif/video?time=${outputStr}&camera_ip=${cameraIp}#t=${timeAction}`;
    },
    setUrlOperationVideoModal(state, action: PayloadAction<string>) {
      state.videoState.url = action.payload;
    },
    setRefVideoModal(state, action) {
      state.playerRef = action.payload;
    },
  },
});

export const {
  setIsOpenOperationVideoModal,
  setTimeOperationVideoModal,
  setUrlOperationVideoModal,
  setRefVideoModal,
} = operationVideoModalSlice.actions;
export const selectOperationVideoModal = (state: RootState) => state.operationVideoModal;
export default operationVideoModalSlice.reducer;
