import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import currentReportReducer from './dataSlice';
import cookiesReducer from './cookiesSlice';
import activeOrderReducer from '../pages/previewOrders/components/OrdersList/ordersListSlice';
import previewOrdersReducer from '../pages/previewOrders/previewOrdersSlice';
import inventoryReducer from '../pages/inventory/inventorySlice';
import operationVideoModalSlice from '../pages/previewOrders/components/OperationVideoModal/operationVideoModalSlice';
import connectToDbModalSlice from '../pages/configuration/components/ConnectToDbModal/connectToDbModalSlice';
import connectionPageSlice from '../pages/configuration/connectionSlice';
import disconnectDBModalSlice from '../pages/configuration/components/DisconnectDbModal/disconnectDbModalSlice';
import editInventoryModalSlice from '../pages/inventory/components/EditInventoryModal/editInventoryModalSlice';
import InventoryItemsListSlice from '../pages/inventory/components/InventoryItemsList/InventoryItemsListSlice';
import addInventoryModalSlice from '../pages/inventory/components/AddInventoryModal/addInventoryModalSlice';
import stockImageModalSlice from '../pages/inventory/components/StockImageModal/stockImageModalSlice';

export const store = configureStore({
  reducer: {
    currentReport: currentReportReducer,
    token: cookiesReducer,
    activeOrder: activeOrderReducer,
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
