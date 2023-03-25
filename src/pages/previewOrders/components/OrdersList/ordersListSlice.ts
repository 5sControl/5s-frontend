import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { OrdersWithPagination, PreviewOrderItem } from '../../../../storage/orderView';
import { OrderListByCustomer } from '../../../../storage/orderViewCustomer';
import { RootState } from '../../../../store';
import { parseOrderData } from './orderListHelper';
import { getOrdersAPI, getOrdersByQueryAPI } from './ordersListAPI';

interface ReportState {
  activeOrder: null | string;
  search: string | null;
  isLoadingOrdersList: boolean;
  isErrorOfOrdersList: boolean;
  ordersList: OrdersWithPagination | null;
  errorOfOrdersData: SerializedError;
}

const initialState: ReportState = {
  activeOrder: null,
  search: null,
  isLoadingOrdersList: false,
  isErrorOfOrdersList: false,
  ordersList: null,
  errorOfOrdersData: {},
};

export const getOrdersAsync = createAsyncThunk(
  'getOrders',
  async (data: {
    token: string;
    hostname: string;
    page: number;
    page_size: number;
    search: string | null;
  }) => {
    const response = await getOrdersAPI(
      data.hostname,
      data.token,
      data.page,
      data.page_size,
      data.search
    );
    if (response.data) {
      console.log('getOrdersAsync', response.data);

      const orderData = response.data.results.map((item: OrderListByCustomer) => {
        return parseOrderData(item);
      });

      return { ...response.data, results: orderData };
    }
    return [];
  }
);

export const getSearchOrdersAsync = createAsyncThunk(
  'getOrdersByQuery',
  async (data: { token: string; hostname: string; query: string }) => {
    const response = await getOrdersByQueryAPI(data.hostname, data.token, data.query);
    if (response.data) {
      console.log('getOrdersAsync', response.data);
      const orderData = response.data.map((item: OrderListByCustomer) => {
        return parseOrderData(item);
      });
      return orderData;
    }
    return '';
  }
);

const ordersList = createSlice({
  name: 'ordersList',
  initialState,
  reducers: {
    addActiveOrder(state, action: PayloadAction<string>) {
      state.activeOrder = action.payload;
    },
    setSearchValue(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    clearOrdersList(state) {
      state.ordersList = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrdersAsync.pending, (state) => {
      state.isLoadingOrdersList = true;
    });
    builder.addCase(getOrdersAsync.fulfilled, (state, action) => {
      state.isLoadingOrdersList = false;
      state.isErrorOfOrdersList = false;
      state.ordersList = action.payload as OrdersWithPagination;
    });
    builder.addCase(getOrdersAsync.rejected, (state, action) => {
      state.isLoadingOrdersList = false;
      state.isErrorOfOrdersList = true;
      state.errorOfOrdersData = action.error;
    });
    builder.addCase(getSearchOrdersAsync.pending, (state) => {
      state.isLoadingOrdersList = true;
    });
    builder.addCase(getSearchOrdersAsync.fulfilled, (state, action) => {
      state.isLoadingOrdersList = false;
      state.isErrorOfOrdersList = false;
      state.ordersList && (state.ordersList.results = action.payload as PreviewOrderItem[]);
    });
    builder.addCase(getSearchOrdersAsync.rejected, (state, action) => {
      state.isLoadingOrdersList = false;
      state.isErrorOfOrdersList = true;
      state.errorOfOrdersData = action.error;
    });
  },
});

export const { addActiveOrder, setSearchValue, clearOrdersList } = ordersList.actions;
export const selectOrdersList = (state: RootState) => state.orderList;
export default ordersList.reducer;
