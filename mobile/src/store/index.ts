import { configureStore } from '@reduxjs/toolkit'
import orderReducer from './orderSlice'
import userReducer from './userSlice'

const store = configureStore({
    reducer: {
        order: orderReducer,
        user: userReducer
    }
})

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
