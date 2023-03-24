import { OperationItem, OrdersWithPagination, ProductItem } from './../../storage/orderView';
import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { OrderItem } from '../../storage/orderView';
import { OrderListByCustomer } from '../../storage/orderViewCustomer';
import { RootState } from '../../store';
import { getOrderData, getOrdersId } from './previewOrdersAPI';
import { parseOrderData, parseOrdersData } from './previewOrdersHelper';

interface PreviewOrders {
  orderData: OrderItem | null;
  selectProductData: ProductItem | undefined;
  selectOperationData: OperationItem | undefined;
  isLoadingPreviewList: boolean;
  isLoadingCurrentOrder: boolean;
  isErrorOfOrders: boolean;
  errorOfOrdersData: SerializedError;
  errorOfCurrentOrder: boolean;
  previewOrdersList: OrdersWithPagination | null;
}

const initialState: PreviewOrders = {
  orderData: null,
  selectProductData: undefined,
  selectOperationData: undefined,
  isLoadingPreviewList: false,
  isLoadingCurrentOrder: false,
  isErrorOfOrders: false,
  errorOfOrdersData: {},
  errorOfCurrentOrder: false,
  previewOrdersList: null,
};

export const getOrderAsync = createAsyncThunk(
  'getOrderData',
  async (data: { token: string; hostname: string; currentOrder: string }) => {
    const response = await getOrderData(data.hostname, data.token, data.currentOrder);

    if (response.data) {
      console.log(response.data[0]);
      return parseOrdersData(response.data[0]);
    }
    return null;
  }
);

export const getOrdersAsync = createAsyncThunk(
  'getOrders',
  async (data: { token: string; hostname: string; page: number; limit: number }) => {
    const response = await getOrdersId(data.hostname, data.token, data.page, data.limit);
    if (response.data) {
      const orderData = response.data.results.map((item: OrderListByCustomer) => {
        return parseOrderData(item);
      });

      return { ...response.data, results: orderData };
    }
    return [];
  }
);

const previewOrdersPage = createSlice({
  name: 'previewOrdersPage',
  initialState,
  reducers: {
    setIsError: (state, action) => {
      state.errorOfCurrentOrder = action.payload;
    },
    setSelectOperationData(state, action: PayloadAction<OperationItem>) {
      state.selectOperationData = action.payload;
    },
    setSelectProductData(state, action: PayloadAction<ProductItem>) {
      state.selectProductData = action.payload;
    },
    clearPreviewOrdersList(state) {
      state.previewOrdersList = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrderAsync.pending, (state) => {
      state.isLoadingCurrentOrder = true;
    });
    builder.addCase(getOrderAsync.fulfilled, (state, action) => {
      state.isLoadingCurrentOrder = false;
      state.orderData = action.payload;
    });
    builder.addCase(getOrderAsync.rejected, (state) => {
      state.isLoadingCurrentOrder = false;
      state.errorOfCurrentOrder = true;
    });
    builder.addCase(getOrdersAsync.pending, (state) => {
      state.isLoadingPreviewList = true;
    });
    builder.addCase(getOrdersAsync.fulfilled, (state, action) => {
      state.isLoadingPreviewList = false;
      state.isErrorOfOrders = false;
      state.previewOrdersList = action.payload as OrdersWithPagination;
    });
    builder.addCase(getOrdersAsync.rejected, (state, action) => {
      state.isLoadingPreviewList = false;
      state.isErrorOfOrders = true;
      state.errorOfOrdersData = action.error;
    });
  },
});

export const { setIsError, setSelectOperationData, setSelectProductData, clearPreviewOrdersList } =
  previewOrdersPage.actions;
export const selectPreviewOrders = (state: RootState) => state.previewOrders;
export default previewOrdersPage.reducer;
