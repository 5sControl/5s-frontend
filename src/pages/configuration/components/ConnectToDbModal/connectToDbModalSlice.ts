import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

interface ConnectToDbModalState {
  isOpenConnectToDbModal: boolean;
}

const initialState: ConnectToDbModalState = {
  isOpenConnectToDbModal: false,
};

const connectToDbModalSlice = createSlice({
  name: 'connectToDbModal',
  initialState,
  reducers: {
    setIsOpenConnectToDbModal(state, action: PayloadAction<boolean>) {
      state.isOpenConnectToDbModal = action.payload;
    },
  },
});

export const { setIsOpenConnectToDbModal } = connectToDbModalSlice.actions;
export const selectConnectToDbModal = (state: RootState) => state.connectToDbModal;
export default connectToDbModalSlice.reducer;
