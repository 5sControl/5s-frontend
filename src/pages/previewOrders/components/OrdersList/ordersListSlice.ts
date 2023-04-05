import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { OrdersWithPagination } from '../../../../storage/orderView';
import { OrderListByCustomer } from '../../../../storage/orderViewCustomer';
import { RootState } from '../../../../store';
import { parseOrderData } from './orderListHelper';
import { getOrdersAPI } from './ordersListAPI';

export type FilterDataType = {
  'order-status': string;
  'operation-status': string[];
};

interface ReportState {
  activeOrder: null | string;
  search: string | null;
  isLoadingOrdersList: boolean;
  isErrorOfOrdersList: boolean;
  ordersList: OrdersWithPagination | null;
  errorOfOrdersData: SerializedError;

  isShowOrdersViewFilter: boolean;
  filterData: FilterDataType;
}

const initialState: ReportState = {
  activeOrder: null,
  search: null,
  isLoadingOrdersList: false,
  isErrorOfOrdersList: false,
  ordersList: null,
  errorOfOrdersData: {},

  isShowOrdersViewFilter: false,
  filterData: {
    'order-status': 'all',
    'operation-status': [],
  },
};

export const getOrdersAsync = createAsyncThunk(
  'getOrders',
  async (data: {
    token: string;
    hostname: string;
    page: number;
    page_size: number;
    search: string | null;
    params: FilterDataType;
  }) => {
    const response = await getOrdersAPI(
      data.hostname,
      data.token,
      data.page,
      data.page_size,
      data.search,
      data.params
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

const ordersList = createSlice({
  name: 'ordersList',
  initialState,
  reducers: {
    addActiveOrder(state, action: PayloadAction<string | null>) {
      state.activeOrder = action.payload;
    },
    setSearchValue(state, action: PayloadAction<string | null>) {
      state.search = action.payload;
    },
    clearOrdersList(state) {
      state.ordersList = null;
    },
    setIsShowOrdersViewFilter(state, action: PayloadAction<boolean>) {
      state.isShowOrdersViewFilter = action.payload;
    },
    setOrderStatusFilterData(state, action: PayloadAction<string>) {
      state.filterData['order-status'] = action.payload;
    },
    setOperationStatusFilterData(state, action: PayloadAction<string>) {
      if (state.filterData['operation-status'].includes(action.payload)) {
        const index = state.filterData['operation-status'].indexOf(action.payload);
        state.filterData['operation-status'].splice(index, 1);
      } else {
        state.filterData['operation-status'] = [
          ...state.filterData['operation-status'],
          action.payload,
        ];
      }
    },
    resetFilterData(state) {
      state.filterData = {
        ...state.filterData,
        'order-status': 'all',
        'operation-status': [],
      };
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
  },
});

export const {
  addActiveOrder,
  setSearchValue,
  clearOrdersList,
  setIsShowOrdersViewFilter,
  setOrderStatusFilterData,
  setOperationStatusFilterData,
  resetFilterData,
} = ordersList.actions;
export const selectOrdersList = (state: RootState) => state.orderList;
export default ordersList.reducer;
