import { OperationItem, ProductItem } from './../../storage/orderView';
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { OrderItem } from '../../storage/orderView';
import { RootState } from '../../store';
import { getOrderData } from './previewOrdersAPI';
import { parseOrdersData } from './previewOrdersHelper';

interface PreviewOrders {
  orderData: OrderItem | null;
  selectProductData: ProductItem | undefined;
  selectOperationData: OperationItem | undefined;
  isLoadingPreviewList: boolean;
  isLoadingCurrentOrder: boolean;
  isErrorOfOrders: boolean;
  errorOfOrdersData: SerializedError;
  errorOfCurrentOrder: boolean;
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
};

export const getOrderAsync = createAsyncThunk(
  'getOrderData',
  async (data: { token: string; hostname: string; currentOrder: string }) => {
    const response = await getOrderData(
      data.hostname,
      data.token,
      data.currentOrder
    );

    if (response.data) {
      return parseOrdersData(response.data[0]);
    }
    return null;
  }
);

const previewOrdersPage = createSlice({
  name: 'previewOrdersPage',
  initialState,
  reducers: {
    setSelectOperationData(state, action: PayloadAction<OperationItem>) {
      state.selectOperationData = action.payload;
    },
    setSelectProductData(state, action: PayloadAction<ProductItem>) {
      state.selectProductData = action.payload;
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
  },
});

export const { setSelectOperationData, setSelectProductData } =
  previewOrdersPage.actions;
export const selectPreviewOrders = (state: RootState) => state.previewOrders;
export default previewOrdersPage.reducer;
