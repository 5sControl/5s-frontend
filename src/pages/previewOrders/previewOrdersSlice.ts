import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { OrderItem } from '../../storage/orderView';
import { RootState } from '../../store';
import { getOrdersData } from './previewOrdersAPI';

interface PreviewOrders {
  orderdData: Array<OrderItem> | null;
  isLoading: boolean;
  error: boolean;
}

const initialState: PreviewOrders = {
  orderdData: null,
  isLoading: false,
  error: false,
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

const parseOrdersData = (data: any) => {
  const previewData = data.map((item: any) => {
    return {
      id: item.indeks,
      orderDate: item.data,
      orderId: item.zlecenie.replace(/\s/g, ''),
      orderCustomer: item.klient,
      orderValid: 30,
      orderTime: item.datawejscia,
      orderStatus: getStatus(item.zakonczone, item.datawejscia),
      product: {
        productName: item.typ,
        operationArticle: item.orderName,
        operations: item.skans.map((element: any) => {
          return {
            operationId: element.indeks,
            operationName: element.raport,
            operationTime: element.data,
          };
        }),
      },
    };
  });

  return previewData;
};

const getStatus = (zakonczone: number, datawejscia: string) => {
  if (zakonczone === 1) {
    return 'Completed';
  }

  if (zakonczone === 0 && datawejscia) {
    return 'Started';
  }
};

const ordersList = createSlice({
  name: 'previewOrders',
  initialState,
  reducers: {
    setIsError: (state, action) => {
      state.error = action.payload;
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

export const { setIsError } = ordersList.actions;
export const selectOrders = (state: RootState) => state.orders;
export default ordersList.reducer;
