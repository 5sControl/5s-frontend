import { configureStore } from "@reduxjs/toolkit";
import currentReportReducer from './dataSlice'
import cookiesReducer from './cookiesSlice'

export default configureStore(
    {
        reducer:{
            currentReport:currentReportReducer,
            token:cookiesReducer,
        }
    }
)