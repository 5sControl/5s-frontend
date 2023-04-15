import axios from 'axios';
import { proxy } from '../../api/api';
import { AddInventoryData } from './components/AddInventoryModal/types';
import { EditInventoryDataResponse } from './components/EditInventoryModal/types';

export const getInventoryItems = (hostname: string, cookies: string, isSort: boolean) => {
  const API_BY_ORDER = `api/inventory/items/${isSort ? '?order=desc' : ''}`;

  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_BY_ORDER, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_BY_ORDER}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_BY_ORDER}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getInventoryItemsToCamera = (
  hostname: string,
  cookies: string,
  camera: string | undefined
) => {
  const API_BY_ORDER = `api/inventory/items/?camera=${camera}`;

  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_BY_ORDER, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_BY_ORDER}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_BY_ORDER}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const setInventoryItem = (hostname: string, cookies: string, body: AddInventoryData) => {
  const API_INVENTORY_SET = 'api/inventory/items/create/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: process.env.REACT_APP_NGROK + API_INVENTORY_SET,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify(body),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(process.env.REACT_APP_IP_SERVER + API_INVENTORY_SET, body, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.post(`http://${hostname}/${API_INVENTORY_SET}`, body, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const editInventoryItemAxios = (
  hostname: string,
  cookies: string,
  body: EditInventoryDataResponse
) => {
  const API_INVENTORY_SET = 'api/inventory/items/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: process.env.REACT_APP_NGROK + API_INVENTORY_SET + body.id + '/',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify(body),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.put(process.env.REACT_APP_IP_SERVER + API_INVENTORY_SET + body.id + '/', body, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.put(`http://${hostname}/${API_INVENTORY_SET}${body.id}/`, body, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const deleteInventoryItemAxios = (hostname: string, cookies: string, id: number) => {
  const API_INVENTORY_DELETE = 'api/inventory/items/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_INVENTORY_DELETE + id + '/', 'DELETE', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.delete(`${process.env.REACT_APP_IP_SERVER}${API_INVENTORY_DELETE}${id}/`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.delete(`http://${hostname}/${API_INVENTORY_DELETE}${id}/`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getInventoryItemHistory = (
  hostname: string,
  cookies: string,
  data: { itemId: number; date: string }
) => {
  const API_HISTORY = 'api/inventory/history/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(
      `${process.env.REACT_APP_NGROK}${API_HISTORY}${data.date}/00:00:00/23:59:00/${data.itemId}/`,
      'GET',
      {
        Authorization: cookies,
      }
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(
      `${process.env.REACT_APP_IP_SERVER}${API_HISTORY}${data.date}/00:00:00/23:59:00/${data.itemId}/`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  } else {
    return axios.get(
      `http://${hostname}/${API_HISTORY}${data.date}/00:00:00/23:59:00/${data.itemId}/`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  }
};
