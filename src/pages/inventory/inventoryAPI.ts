import axios from 'axios';
import { getIsInternet, proxy, url } from '../../api/api';

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
