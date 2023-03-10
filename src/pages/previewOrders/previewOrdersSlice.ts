import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem, PreviewOrderItem } from '../../storage/orderView';
import { RootState } from '../../store';
import { getOrderData, getOrdersId } from './previewOrdersAPI';
import { parseOrdersData } from './previewOrdersHelper';

interface PreviewOrders {
  orderData: OrderItem | null;
  previewOrdersList: Array<PreviewOrderItem> | null;
  isLoadingPreviewList: boolean;
  isLoadingCurrentOrder: boolean;
  errorOfList: boolean;
  errorOfCurrentOrder: boolean;
  isOpenOperationModal: boolean;
}

const initialState: PreviewOrders = {
  orderData: null,
  isLoadingPreviewList: false,
  isLoadingCurrentOrder: false,
  errorOfList: false,
  errorOfCurrentOrder: false,
  previewOrdersList: null,
  isOpenOperationModal: false;

};

export const defenitionAsync = createAsyncThunk(
  'getOrdersData',
  async (data: { token: string; hostname: string; currentOrder: string }) => {
    const response = await getOrderData(data.hostname, data.token, data.currentOrder);
    if (response.data) {
      const data = parseOrdersData(response.data[0]);

      return data;
    }
    return null;
  }
);

export const getOrdersIdAsync = createAsyncThunk(
  'getOrdersId',
  async (data: { token: string; hostname: string }) => {
    const response = await getOrdersId(data.hostname, data.token);
    if (response.data) {
      const data = response.data.map((item: { zlecenie: string; status: string }) => {
        return {
          orderId: item.zlecenie,
          orderStatus: item.status,
        };
      });

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
      state.errorOfCurrentOrder = action.payload;
    },
    setIsOpenOperationModal(state, action: PayloadAction<boolean>) {
      state.isOpenOperationModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(defenitionAsync.pending, (state) => {
      state.isLoadingCurrentOrder = true;
    });
    builder.addCase(defenitionAsync.fulfilled, (state, action) => {
      state.isLoadingCurrentOrder = false;
      state.orderData = action.payload;
    });
    builder.addCase(defenitionAsync.rejected, (state) => {
      state.isLoadingCurrentOrder = false;
      state.errorOfCurrentOrder = true;
    });
    builder.addCase(getOrdersIdAsync.pending, (state) => {
      state.isLoadingPreviewList = true;
    });
    builder.addCase(getOrdersIdAsync.fulfilled, (state, action) => {
      state.isLoadingPreviewList = false;
      state.previewOrdersList = action.payload;
    });
    builder.addCase(getOrdersIdAsync.rejected, (state) => {
      state.isLoadingPreviewList = false;
      state.errorOfList = true;
    });
  },
});

export const { setIsError, setIsOpenOperationModal } = previewOrdersPage.actions;
export const selectPreviewOrders = (state: RootState) => state.previewOrders;
export default previewOrdersPage.reducer;
