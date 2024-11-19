import { configureStore } from '@reduxjs/toolkit'
import orderReducer from './orderSlice'
import userReducer from './userSlice'
import timespanReducer from './timespanSlice'

const store = configureStore({
    reducer: {
        order: orderReducer,
        user: userReducer,
        currentTimespan: timespanReducer
    }
})

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
