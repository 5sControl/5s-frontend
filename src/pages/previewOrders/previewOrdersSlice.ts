import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '../../storage/orderView';
import { RootState } from '../../store';
import { getOrdersData } from './previewOrdersAPI';
import { parseOrdersData } from './previewOrdersHelper';

interface PreviewOrders {
  orderdData: Array<OrderItem> | null;
  isLoading: boolean;
  error: boolean;
  isOpenOperationModal: boolean;
}

const initialState: PreviewOrders = {
  orderdData: null,
  isLoading: false,
  error: false,
  isOpenOperationModal: false,
};

export const defenitionAsync = createAsyncThunk(
  'getOrdersData',
  async (data: { token: string; hostname: string }) => {
    const response = await getOrdersData(data.hostname, data.token);
    if (response.data) {
      const data = parseOrdersData(response.data);

      return data;
    }
    return [];
  }
);

const previewOrdersPage = createSlice({
  name: 'previewOrders',
  initialState,
  reducers: {
    setIsError: (state, action) => {
      state.error = action.payload;
    },
    setIsOpenOperationModal(state, action: PayloadAction<boolean>) {
      state.isOpenOperationModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(defenitionAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(defenitionAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderdData = action.payload;
    });
    builder.addCase(defenitionAsync.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });
  },
});

export const { setIsError, setIsOpenOperationModal } = previewOrdersPage.actions;
export const selectPreviewOrders = (state: RootState) => state.previewOrders;
export default previewOrdersPage.reducer;
