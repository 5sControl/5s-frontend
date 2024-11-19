import { createSlice } from "@reduxjs/toolkit";

const timespanSlice = createSlice({
    name: 'currentTimespan',
    initialState: {
        orderName: null,
        orderYear: null,
        orderItem: null
    },
    reducers: {
        setTimespan(state, action) {
            state.orderName = action.payload.orderName;
            state.orderYear = action.payload.orderYear;
            state.orderItem = action.payload.orderItem;
        },
        clearTimespan(state) {
            state.orderName = null;
            state.orderYear = null;
            state.orderItem =null;
        },
    },
});

export const { setTimespan, clearTimespan } = timespanSlice.actions;
export default timespanSlice.reducer;