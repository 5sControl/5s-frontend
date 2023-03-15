import axios from 'axios';
import { getIsInternet, proxy, url } from '../../api/api';

export const getOrderData = (hostname: string, cookies: string, orderId: string) => {
  const API_BY_ORDER = 'api/order/by-order';

  console.log('you get getOrderData!!!', `http://${hostname}/${API_BY_ORDER}/${orderId}`);

  if (getIsInternet(hostname)) {
    return proxy(`${url}${API_BY_ORDER}/${orderId}`, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname}/${API_BY_ORDER}/${orderId}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getOrdersId = (hostname: string, cookies: string) => {
  const API_ALL_ORDERS = 'api/order/all-orders';

  if (getIsInternet(hostname)) {
    return proxy(`${url}${API_ALL_ORDERS}`, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname}/${API_ALL_ORDERS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
