import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import currentReportReducer from './dataSlice';
import cookiesReducer from './cookiesSlice';
import activeOrderReducer from '../pages/previewOrders/components/OrdersList/ordersListSlice';
import previewOrdersReducer from '../pages/previewOrders/previewOrdersSlice';
import operationVideoModalSlice from '../pages/previewOrders/components/OperationVideoModal/operationVideoModalSlice';

export const store = configureStore({
  reducer: {
    currentReport: currentReportReducer,
    token: cookiesReducer,
    activeOrder: activeOrderReducer,
    previewOrders: previewOrdersReducer,
    operationVideoModal: operationVideoModalSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
