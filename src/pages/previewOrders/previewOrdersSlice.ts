import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem, PreviewOrderItem, ProductItem } from '../../storage/orderView';
import { OrderListByCustomer } from '../../storage/orderViewCustomer';
import { RootState } from '../../store';
import { getOrderData, getOrdersId } from './previewOrdersAPI';
import { parseOrderData, parseOrdersData } from './previewOrdersHelper';

interface PreviewOrders {
  orderData: OrderItem | null;
  productsData: Array<ProductItem>;
  previewOrdersList: Array<PreviewOrderItem> | null;
  isLoadingPreviewList: boolean;
  isLoadingCurrentOrder: boolean;
  errorOfList: boolean;
  errorOfCurrentOrder: boolean;
  isOpenOperationModal: boolean;
}

const initialState: PreviewOrders = {
  orderData: null,
  productsData: [],
  isLoadingPreviewList: false,
  isLoadingCurrentOrder: false,
  errorOfList: false,
  errorOfCurrentOrder: false,
  previewOrdersList: null,
  isOpenOperationModal: false,
};

export const getOrderAsync = createAsyncThunk(
  'getOrdersData',
  async (data: { token: string; hostname: string; currentOrder: string }) => {
    const response = await getOrderData(data.hostname, data.token, data.currentOrder);

    if (response.data) {
      console.log(response.data[0].products);

      return parseOrdersData(response.data[0]);
    }
    return null;
  }
);

export const getOrdersIdAsync = createAsyncThunk(
  'getOrdersId',
  async (data: { token: string; hostname: string }) => {
    const response = await getOrdersId(data.hostname, data.token);
    if (response.data) {
      const data: PreviewOrderItem[] = response.data.map((item: OrderListByCustomer) => {
        return parseOrderData(item);
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
    builder.addCase(getOrderAsync.pending, (state) => {
      state.isLoadingCurrentOrder = true;
    });
    builder.addCase(getOrderAsync.fulfilled, (state, action) => {
      state.isLoadingCurrentOrder = false;
      state.orderData = action.payload;
      // state.productsData = action.payload?.product;
    });
    builder.addCase(getOrderAsync.rejected, (state) => {
      state.isLoadingCurrentOrder = false;
      state.errorOfCurrentOrder = true;
    });
    builder.addCase(getOrdersIdAsync.pending, (state) => {
      state.isLoadingPreviewList = true;
    });
    builder.addCase(
      getOrdersIdAsync.fulfilled,
      (state, action: PayloadAction<Array<PreviewOrderItem>>) => {
        state.isLoadingPreviewList = false;
        state.previewOrdersList = action.payload;
      }
    );
    builder.addCase(getOrdersIdAsync.rejected, (state) => {
      state.isLoadingPreviewList = false;
      state.errorOfList = true;
    });
  },
});

export const { setIsError, setIsOpenOperationModal } = previewOrdersPage.actions;
export const selectPreviewOrders = (state: RootState) => state.previewOrders;
export default previewOrdersPage.reducer;
