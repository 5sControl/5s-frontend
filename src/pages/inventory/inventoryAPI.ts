import axios from 'axios';
import { proxy } from '../../api/api';
import { AddInventoryDataResponse } from './components/AddInventoryModal/types';
import { EditInventoryDataResponse } from './components/EditInventoryModal/types';
import { NightModeResponse } from './components/NightModeModal/types';

export const getInventoryItems = (hostname: string, cookies: string, isSort: boolean) => {
  const API_BY_ORDER = `api/inventory/items/${isSort ? '?order=desc' : ''}`;

  return axios.get(`${process.env.REACT_APP_NGROK}${API_BY_ORDER}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const getInventoryItemsToCamera = (
  hostname: string,
  cookies: string,
  camera: string | undefined
) => {
  const API_BY_ORDER = `api/inventory/items/?camera=${camera}`;

  return axios.get(`${process.env.REACT_APP_NGROK}${API_BY_ORDER}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const setInventoryItem = (
  hostname: string,
  cookies: string,
  body: AddInventoryDataResponse
) => {
  const API_INVENTORY_SET = 'api/inventory/items/create/';

  return axios.post(process.env.REACT_APP_NGROK + API_INVENTORY_SET, body, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const editInventoryItemAxios = (
  hostname: string,
  cookies: string,
  body: EditInventoryDataResponse
) => {
  const API_INVENTORY_SET = 'api/inventory/items/';

  return axios.put(process.env.REACT_APP_NGROK + API_INVENTORY_SET + body.id + '/', body, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const deleteInventoryItemAxios = (hostname: string, cookies: string, id: number) => {
  const API_INVENTORY_DELETE = 'api/inventory/items/';

  return axios.delete(`${process.env.REACT_APP_NGROK}${API_INVENTORY_DELETE}${id}/`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const getInventoryItemHistory = (
  hostname: string,
  cookies: string,
  data: { itemId: number; date: string }
) => {
  const API_HISTORY = 'api/inventory/history/';

  return axios.get(
    `${process.env.REACT_APP_NGROK}${API_HISTORY}${data.date}/00:00:00/23:59:00/${data.itemId}/`,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const setNightTime = (hostname: string, cookies: string, body: NightModeResponse) => {
  const API_INVENTORY_SET = 'api/mailer/working-time/';
  return axios.post(process.env.REACT_APP_NGROK + API_INVENTORY_SET, body, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const getNightTime = (hostname: string, cookies: string) => {
  const API_HISTORY = 'api/mailer/working-time/';

  return axios.get(`${process.env.REACT_APP_NGROK}${API_HISTORY}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const getEmailListForNotificationAPI = (hostname: string, cookies: string) => {
  const API_MAILER = 'api/mailer/emails-list/';

  return axios.get(`${process.env.REACT_APP_NGROK}${API_MAILER}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};
