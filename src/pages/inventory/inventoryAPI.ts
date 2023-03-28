import axios from 'axios';
import { getIsInternet, proxy, url } from '../../api/api';
import { AddInventoryData } from './components/AddInventoryModal/types';
import { EditInventoryData } from './components/EditInventoryModal/types';

export const getInventoryItems = (hostname: string, cookies: string) => {
  const API_BY_ORDER = 'api/inventory/items/';

  if (getIsInternet(hostname)) {
    return proxy(`${url}${API_BY_ORDER}`, 'GET', {
      Authorization: cookies,
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
  const API_INVENTORY_SET = 'api/inventory/items/';

  if (getIsInternet(hostname)) {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: url + API_INVENTORY_SET,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify(body),
    });
  } else {
    {
      return axios.post(`http://${hostname}/${API_INVENTORY_SET}`, body, {
        headers: {
          Authorization: cookies,
        },
      });
    }
  }
};

export const editInventoryItemAxios = (
  hostname: string,
  cookies: string,
  body: EditInventoryData
) => {
  const API_INVENTORY_SET = 'api/inventory/items/';

  if (getIsInternet(hostname)) {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: url + API_INVENTORY_SET + body.id + '/',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify(body),
    });
  } else {
    return axios.post(`http://${hostname}/${API_INVENTORY_SET}`, body, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const deleteInventoryItemAxios = (hostname: string, cookies: string, id: number) => {
  const API_INVENTORY_DELETE = 'api/inventory/items/';

  if (getIsInternet(hostname)) {
    return proxy(`${url}${API_INVENTORY_DELETE}${id}/`, 'DELETE', {
      Authorization: cookies,
    });
  } else {
    return axios.delete(`http://${hostname}/${API_INVENTORY_DELETE}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getInventoryItemHistory = (
  hostname: string,
  cookies: string,
  data: { camera: string; date: string }
) => {
  const API_HISTORY = 'api/inventory/history/';

  if (getIsInternet(hostname)) {
    return proxy(`${url}${API_HISTORY}${data.camera}/${data.date}/00:00:00/23:59:00/`, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get(
      `http://${hostname}/${API_HISTORY}${data.camera}/${data.date}/00:00:00/23:59:00/`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  }
};
