import axios from 'axios';
import { getIsInternet, proxy, url } from '../../api/api';

export const getOrdersData = (hostname: string, cookies: string) => {
  const urlString = 'api/order/';
  const urlStringAll = 'api/order/all-orders';

  if (getIsInternet(hostname)) {
    return proxy(`${url + urlString}`, 'GET', {
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
