import axios from 'axios';
import { getIsInternet, proxy, url } from '../../api/api';

export const getOrderData = (hostname: string, cookies: string, currentOrder: number) => {
  const urlString = 'api/order/by/';

  if (getIsInternet(hostname)) {
    return proxy(`${url + urlString + currentOrder}`, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname + '/' + urlString}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getOrdersId = (hostname: string, cookies: string) => {
  const urlStringAll = 'api/order/all-orders';

  if (getIsInternet(hostname)) {
    return proxy(`${url + urlStringAll}`, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname + '/' + urlStringAll}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
