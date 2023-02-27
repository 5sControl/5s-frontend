/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { useCookies } from "react-cookie";

const cookies = createSlice({
    name:"cookies",
    initialState:{
        report:false,
    },
    reducers:{
    setToken(state, action){
        state.report = action.payload;
    },
    deleteToken(state, action){
        state.report = action.payload;
    },
    }
})

export const {addCurrentReport } = cookies.actions
export default cookies.reducer; 