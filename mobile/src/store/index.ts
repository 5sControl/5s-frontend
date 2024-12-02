import { configureStore } from '@reduxjs/toolkit'
import orderReducer from './orderSlice'
import userReducer from './userSlice'
import timespanReducer from './timespanSlice'
import reportDateSlice from './reportDateSlice'
import { dynamicApiSlice } from './dynamicApiSlice'
import { useDispatch, useSelector } from 'react-redux'

const store = configureStore({
    reducer: {
        order: orderReducer,
        user: userReducer,
        currentTimespan: timespanReducer,
        reportDate: reportDateSlice,
        [dynamicApiSlice.reducerPath]: dynamicApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(dynamicApiSlice.middleware),
})

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()