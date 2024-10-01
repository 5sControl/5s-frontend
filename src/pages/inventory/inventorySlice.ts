import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
  getEmailListForNotificationAPI,
  getInventoryItemHistory,
  getInventoryItems,
} from './inventoryAPI';
import { getSelectedCameras } from '../../api/cameraRequest';
import { Camera, InventoryHistory, InventoryItem } from './types';
import { getNotificationSettings } from '../../api/notificationRequest';
import { getCompanyInfoForm } from '../../api/companyRequest';
import { AxiosResponse } from 'axios';
import { ContactInfoType } from '../company/types';

interface NotificationInfoType {
  to_emails: string[] | null;
  copy_emails: string[] | null;
  subject: string | null;
}

interface Inventory {
  isLoading: boolean;
  errorOfInventoryItems: boolean;
  inventoryItems: null | Array<InventoryItem>;
  isLoadingHistory: boolean;
  inventoryHistoryData: Array<InventoryHistory> | null;
  errorOfInventoryHistory: boolean;
  isLoadingCameras: boolean;
  camerasData: Array<{ id: string; text: string }> | null;
  errorOfgetCameras: boolean;
  isSMTPServerConnect: boolean;
  isFullOwnCompanyInfo: boolean;
  emailsListHelper: string[] | null;
  isOpenNotificationModal: boolean;
  emailNotificationInfo: NotificationInfoType;
  currentName: string;
}

const initialState: Inventory = {
  isLoading: false,
  inventoryItems: null,
  errorOfInventoryItems: false,
  isLoadingHistory: false,
  inventoryHistoryData: null,
  errorOfInventoryHistory: false,
  isLoadingCameras: false,
  camerasData: null,
  errorOfgetCameras: false,
  isSMTPServerConnect: false,
  isFullOwnCompanyInfo: false,
  emailsListHelper: null,
  isOpenNotificationModal: false,
  emailNotificationInfo: {
    to_emails: null,
    copy_emails: null,
    subject: null,
  },
  currentName: '',
};

export const getInventoryItemsAsync = createAsyncThunk(
  'getInventoryItems',
  async (data: { token: string; hostname: string; isSort: boolean }) => {
    const response: any = await getInventoryItems(
      data.hostname,
      data.token,
      data.isSort
    );
    if (response.data) {
      return response.data;
    }
    return null;
  }
);

export const getInventoryItemHistoryAsync = createAsyncThunk(
  'getInventoryHistory',
  async (data: {
    token: string;
    hostname: string;
    params: { itemId: number; date: string };
  }) => {
    const response: any = await getInventoryItemHistory(
      data.hostname,
      data.token,
      data.params
    );
    if (response.data) {
      return response.data;
    }
    return null;
  }
);

export const getCamerasAsync = createAsyncThunk(
  'getCameras',
  async (data: { token: string; hostname: string }) => {
    const response = await getSelectedCameras(data.hostname, data.token);
    if (response.data) {
      return response.data.map((item: Camera) => {
        return { text: item.name, id: item.id };
      });
    }
    return null;
  }
);

export const getSMTPConnect = createAsyncThunk(
  'getSMTPConnect',
  async (data: { token: string; hostname: string }) => {
    const response = await getNotificationSettings(data.hostname, data.token);
    return !!(response.data && response.data.server);
  }
);

export const getEmailListForNotification = createAsyncThunk(
  'getEmailListForNotification',
  async (data: { token: string; hostname: string }) => {
    const response = await getEmailListForNotificationAPI(
      data.hostname,
      data.token
    );
    return response.data;
  }
);

export const getIsFullOwnCompanyInfo = createAsyncThunk(
  'getIsFullOwnCompanyInfo',
  async (data: { token: string; hostname: string }) => {
    const response: AxiosResponse<ContactInfoType[]> = await getCompanyInfoForm(
      data.hostname,
      data.token
    );
    const info = response.data[0];

    return (
      !!info.name_company &&
      !!info.first_address &&
      !!info.city &&
      !!info.state &&
      !!info.country &&
      !!info.contact_phone &&
      !!info.contact_email
    );
  }
);

const inventoryPage = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setIsOpenNotificationModal(state, action: PayloadAction<boolean>) {
      state.isOpenNotificationModal = action.payload;
    },
    setNotificationInfo(state, action: PayloadAction<NotificationInfoType>) {
      state.emailNotificationInfo = action.payload;
    },
    setCurrentItemName(state, action: PayloadAction<string>) {
      state.currentName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInventoryItemsAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getInventoryItemsAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.inventoryItems = action.payload;
    });
    builder.addCase(getInventoryItemsAsync.rejected, (state) => {
      state.isLoading = false;
      state.errorOfInventoryItems = true;
    });
    builder.addCase(getInventoryItemHistoryAsync.pending, (state) => {
      state.isLoadingHistory = true;
    });
    builder.addCase(getInventoryItemHistoryAsync.fulfilled, (state, action) => {
      state.isLoadingHistory = false;
      state.inventoryHistoryData = action.payload;
    });
    builder.addCase(getInventoryItemHistoryAsync.rejected, (state) => {
      state.isLoadingHistory = false;
      state.errorOfInventoryHistory = true;
    });
    builder.addCase(getCamerasAsync.pending, (state) => {
      state.isLoadingCameras = true;
    });
    builder.addCase(getCamerasAsync.fulfilled, (state, action) => {
      state.isLoadingCameras = false;
      state.camerasData = action.payload;
    });
    builder.addCase(getCamerasAsync.rejected, (state) => {
      state.isLoadingCameras = false;
      state.errorOfgetCameras = true;
    });
    builder.addCase(getSMTPConnect.fulfilled, (state, action) => {
      state.isSMTPServerConnect = action.payload;
    });
    builder.addCase(getIsFullOwnCompanyInfo.fulfilled, (state, action) => {
      state.isFullOwnCompanyInfo = action.payload;
    });
    builder.addCase(getEmailListForNotification.fulfilled, (state, action) => {
      state.emailsListHelper = action.payload;
    });
  },
});

export const {
  setIsOpenNotificationModal,
  setNotificationInfo,
  setCurrentItemName,
} = inventoryPage.actions;
export const selectInventory = (state: RootState) => state.inventory;
export default inventoryPage.reducer;
