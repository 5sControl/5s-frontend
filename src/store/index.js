import { configureStore } from "@reduxjs/toolkit";
import currentReportReducer from './dataSlice'

export default configureStore(
    {
        reducer:{
            currentReport:currentReportReducer,
        }
    }
)