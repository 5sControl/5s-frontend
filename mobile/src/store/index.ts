import { configureStore } from '@reduxjs/toolkit'
import orderReducer from './orderSlice'

const store = configureStore({
    reducer: {
        order: orderReducer
    }
})

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
