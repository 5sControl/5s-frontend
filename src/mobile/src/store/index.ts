import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import currentReportReducer from './dataSlice';
import cookiesReducer from './cookiesSlice';
import connectionPageSlice from '../utils/connectionSlice';

export const store = configureStore({
  reducer: {
    currentReport: currentReportReducer,
    token: cookiesReducer,
    connectionPage: connectionPageSlice,
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
