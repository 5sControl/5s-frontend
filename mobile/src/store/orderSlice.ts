import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderName: '',
    orderItems: {},
    maxOrderItemId: 1,
    tempOrderItemId: -1,
    orderItemOperations: [],
  },
  reducers: {
    setOrderName(state, action) {
      state.orderName = action.payload;
    },
    setOrderItems(state, action) {
      state.orderItems = action.payload;
    },
    setMaxOrderItemId(state, action) {
      state.maxOrderItemId = action.payload;
    },
    setTempOrderItemId(state, action) {
      state.tempOrderItemId = action.payload;
    },
    setOrderItemOperations(state, action) {
      state.orderItemOperations = action.payload;
    },
  },
});

export const { setOrderName, setOrderItems, setMaxOrderItemId, setTempOrderItemId, setOrderItemOperations } = orderSlice.actions;
export default orderSlice.reducer;