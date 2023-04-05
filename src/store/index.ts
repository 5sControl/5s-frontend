import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import currentReportReducer from './dataSlice';
import cookiesReducer from './cookiesSlice';
import orderListReducer from '../pages/previewOrders/components/OrdersList/ordersListSlice';
import previewOrdersReducer from '../pages/previewOrders/previewOrdersSlice';
import inventoryReducer from '../pages/inventory/inventorySlice';
import operationVideoModalSlice from '../pages/previewOrders/components/OperationVideoModal/operationVideoModalSlice';
import connectToDbModalSlice from '../pages/configuration/components/ConnectToDbModal/connectToDbModalSlice';
import connectionPageSlice from '../pages/configuration/connectionSlice';
import disconnectDBModalSlice from '../pages/configuration/components/DisconnectDbModal/disconnectDbModalSlice';
import InventoryItemsListSlice from '../pages/inventory/components/InventoryItemsList/InventoryItemsListSlice';
import addInventoryModalSlice from '../pages/inventory/components/AddInventoryModal/addInventoryModalSlice';
import stockImageModalSlice from '../pages/inventory/components/StockImageModal/stockImageModalSlice';
import infoPageSlice from '../pages/info/infoSlice';
import deleteInventoryModalSlice from '../pages/inventory/components/DeleteInventoryModal/deleteInventoryModalSlice';
import editInventoryModalSlice from '../pages/inventory/components/EditInventoryModal/editInventoryModalSlice';
import inventoryHistorySlice from '../pages/inventory/components/InventoryHistory/inventoryHistorySlice';
import inventoryReportSlice from '../pages/inventory/components/InventoryReport/InventoryReportSlice';

export const store = configureStore({
  reducer: {
    currentReport: currentReportReducer,
    token: cookiesReducer,
    orderList: orderListReducer,
    previewOrders: previewOrdersReducer,
    operationVideoModal: operationVideoModalSlice,
    inventory: inventoryReducer,
    connectToDbModal: connectToDbModalSlice,
    disconnectDBModal: disconnectDBModalSlice,
    connectionPage: connectionPageSlice,
    editInventoryModal: editInventoryModalSlice,
    addInventoryModal: addInventoryModalSlice,
    activeInventoryItem: InventoryItemsListSlice,
    stockImageModal: stockImageModalSlice,
    infoPage: infoPageSlice,
    deleteInventoryModal: deleteInventoryModalSlice,
    inventoryHistory: inventoryHistorySlice,
    inventoryReportState: inventoryReportSlice,
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
