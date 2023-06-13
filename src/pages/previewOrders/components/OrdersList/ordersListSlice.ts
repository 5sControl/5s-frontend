import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { OrdersWithPagination } from '../../../../storage/orderView';
import { OrderListByCustomer } from '../../../../storage/orderViewCustomer';
import { RootState } from '../../../../store';
import { getFilterOperationsAPI } from '../FilterBar/filterBarAPI';
import { parseOrderData } from './orderListHelper';
import { getOrdersAPI } from './ordersListAPI';

export interface FilterDataType {
  'order-status': string;
  'operation-name': string[];
  'operation-status': string[];
}

export interface FilterDateDataType {
  from: string;
  to: string;
}

export interface FilterDataParams extends FilterDataType, FilterDateDataType {}

interface ReportState {
  activeOrder: null | string;
  search: string | null;
  isLoadingOrdersList: boolean;
  isErrorOfOrdersList: boolean;
  ordersList: OrdersWithPagination | null;
  errorOfOrdersData: SerializedError;

  isShowOrdersViewFilter: boolean;
  filterData: FilterDataType;
  filterDateData: FilterDateDataType;
  isLoadingFilterOperations: boolean;
  isErrorFilterOperations: boolean;
  filterOperationsData: Array<string>;
  errorFilterOperations: SerializedError;
}

const currentDate = new Date();
currentDate.setDate(5);
console.log(currentDate);
const startDateDefault = currentDate.toISOString();

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
    'operation-name': [],
    'operation-status': [],
  },
  filterDateData: {
    from: startDateDefault,
    to: new Date().toISOString(),
  },
  isLoadingFilterOperations: false,
  isErrorFilterOperations: false,
  filterOperationsData: [],
  errorFilterOperations: {},
};

export const getOrdersAsync = createAsyncThunk(
  'getOrders',
  async (data: {
    token: string;
    hostname: string;
    page: number;
    page_size: number;
    search: string | null;
    params: FilterDataParams;
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
      const orderData = response.data.results.map((item: OrderListByCustomer) => {
        return parseOrderData(item);
      });

      return { ...response.data, results: orderData };
    }
    return [];
  }
);

export const getFilterOperationsAsync = createAsyncThunk(
  'getFilterOperations',
  async (data: { token: string; hostname: string }) => {
    const response = await getFilterOperationsAPI(data.hostname, data.token);
    if (response.data) {
      return response.data;
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
    setOperationsFilterData(state, action: PayloadAction<{ [key: string]: string }>) {
      const key = Object.keys(action.payload)[0] as 'operation-name' | 'operation-status';
      const value = Object.values(action.payload)[0];

      if (state.filterData[key].includes(value)) {
        const index = state.filterData[key].indexOf(value);
        state.filterData[key].splice(index, 1);
      } else {
        state.filterData[key] = [...state.filterData[key], value];
      }
    },
    setFilterData(state, action) {
      state.filterData = action.payload;
    },
    resetSelectFilterData(state, action) {
      if (action.payload === 'order-status') {
        state.filterData = {
          ...state.filterData,
          [action.payload]: 'all',
        };
      } else {
        state.filterData = {
          ...state.filterData,
          [action.payload]: [],
        };
      }
    },
    resetAllFilterData(state) {
      state.filterData = {
        ...state.filterData,
        'order-status': 'all',
        'operation-name': [],
        'operation-status': [],
      };
    },
    setFilterDateData(state, action) {
      state.filterDateData = {
        ...state.filterDateData,
        from: action.payload.from,
        to: action.payload.to,
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

    builder.addCase(getFilterOperationsAsync.pending, (state) => {
      state.isLoadingFilterOperations = true;
    });
    builder.addCase(getFilterOperationsAsync.fulfilled, (state, action) => {
      state.isLoadingFilterOperations = false;
      state.isErrorFilterOperations = false;
      state.filterOperationsData = (action.payload as string[]).sort();
    });
    builder.addCase(getFilterOperationsAsync.rejected, (state, action) => {
      state.isLoadingFilterOperations = false;
      state.isErrorFilterOperations = true;
      state.errorFilterOperations = action.error;
    });
  },
});

export const {
  addActiveOrder,
  setSearchValue,
  clearOrdersList,
  setIsShowOrdersViewFilter,
  setOrderStatusFilterData,
  setOperationsFilterData,
  resetAllFilterData,
  resetSelectFilterData,
  setFilterData,
  setFilterDateData,
} = ordersList.actions;
export const selectOrdersList = (state: RootState) => state.orderList;
export default ordersList.reducer;
