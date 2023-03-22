import axios from 'axios';
import { getIsInternet, proxy, url } from '../../api/api';
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

export const setInventoryItem = (hostname: string, cookies: string) => {
  const API_INVENTORY_SET = 'api/inventory/items/';

  if (getIsInternet(hostname)) {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: url + API_INVENTORY_SET,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify({
        name: 'Item 1',
        status: 'In stock',
        camera: '192.168.1.168',
        low_stock_level: 5,
        current_stock_level: 0,
        email: null,
      }),
    });
  } else {
    return axios.post(
      `http://${hostname}/${API_INVENTORY_SET}`,
      {
        name: 'Item 1',
        status: 'In stock',
        camera: '192.168.1.168',
        low_stock_level: 5,
        current_stock_level: 0,
        email: null,
      },
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
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

export const getInventoryItemHistory = (
  hostname: string,
  cookies: string,
  data: { camera: string; date: string }
) => {
  const API_BY_ORDER = 'api/inventory/history/';

  if (getIsInternet(hostname)) {
    return proxy(`${url}${API_BY_ORDER}${data.camera}/${data.date}/00:00:00/23:59:00/`, 'GET', {
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
