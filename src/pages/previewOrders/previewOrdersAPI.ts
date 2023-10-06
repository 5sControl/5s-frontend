import axios from 'axios';
import { proxy } from '../../api/api';
import { OrderRequest } from '../../storage/orderViewCustomer';

export const getOrderData = (hostname: string, cookies: string, orderId: string) => {
  const API_BY_ORDER = 'api/order/by-order/';

  return axios.get(process.env.REACT_APP_NGROK + API_BY_ORDER + orderId + '/', {
    headers: {
      Authorization: cookies,
    },
  });
};
