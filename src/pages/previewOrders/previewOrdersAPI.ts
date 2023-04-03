import axios from 'axios';
import { proxy } from '../../api/api';
import { OrderRequest } from '../../storage/orderViewCustomer';

export const getOrderData = (hostname: string, cookies: string, orderId: string) => {
  const API_BY_ORDER = 'api/order/by-order/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy<OrderRequest>(`${process.env.REACT_APP_NGROK}${API_BY_ORDER}${orderId}/`, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(process.env.REACT_APP_IP_SERVER + API_BY_ORDER + orderId + '/', {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_BY_ORDER}${orderId}/`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
