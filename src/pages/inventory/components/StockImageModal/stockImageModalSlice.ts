import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
import { InventoryHistory } from '../../types';

interface StockImageModalState {
  isOpenStockImageModal: boolean;
  currentReportData: InventoryHistory | null;
}

const initialState: StockImageModalState = {
  isOpenStockImageModal: false,
  currentReportData: null,
};

const stockImageModalSlice = createSlice({
  name: 'stockImageModal',
  initialState,
  reducers: {
    setIsOpenStockImageModal(state, action: PayloadAction<boolean>) {
      state.isOpenStockImageModal = action.payload;
    },
    setCurrentReportData(state, action: PayloadAction<InventoryHistory>) {
      state.currentReportData = action.payload;
    },
  },
});

export const { setIsOpenStockImageModal, setCurrentReportData } =
  stockImageModalSlice.actions;
export const selectStockImageModal = (state: RootState) =>
  state.stockImageModal;
export default stockImageModalSlice.reducer;
