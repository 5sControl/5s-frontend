import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

interface ConnectToDbModalState {
  isOpenDisconnectModal: boolean;
}

const initialState: ConnectToDbModalState = {
  isOpenDisconnectModal: false,
};

const connectToDbModalSlice = createSlice({
  name: 'connectToDbModal',
  initialState,
  reducers: {
    setIsOpenDisconnectModal(state, action: PayloadAction<boolean>) {
      state.isOpenDisconnectModal = action.payload;
    },
  },
});

export const { setIsOpenDisconnectModal } = connectToDbModalSlice.actions;
export const selectDisconnectDBModal = (state: RootState) => state.disconnectDBModal;
export default connectToDbModalSlice.reducer;
