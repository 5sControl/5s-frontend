import { createSlice } from "@reduxjs/toolkit";

const timespanSlice = createSlice({
    name: 'currentTimespan',
    initialState: {
        orderName: null,
        orderYear: null,
        orderItem: null,
        timespanWorker: null,
        timespanStatus: null
    },
    reducers: {
        setTimespan(state, action) {
            const { orderName, orderYear, orderItem, timespanWorker, timespanStatus } = action.payload;

            if (orderName) state.orderName = orderName;
            if (orderYear) state.orderYear = orderYear;
            if (orderItem) state.orderItem = orderItem;
            if (timespanWorker) state.timespanWorker = timespanWorker;
            if (timespanStatus) state.timespanStatus = timespanStatus;
        },
        clearTimespan(state) {
            state.orderName = null;
            state.orderYear = null;
            state.orderItem =null;
            state.timespanWorker = null;
            state.timespanStatus = null;
        },
    },
});

export const { setTimespan, clearTimespan } = timespanSlice.actions;
export default timespanSlice.reducer;