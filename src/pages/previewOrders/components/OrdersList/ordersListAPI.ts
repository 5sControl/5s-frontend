import axios from 'axios';
import { proxy } from '../../../../api/api';
import {
  OrderListByCustomer,
  OrderWithPaginationCustomer,
} from '../../../../storage/orderViewCustomer';

export const getOrdersAPI = (
  hostname: string,
  cookies: string,
  page: number,
  page_size: number,
  search: string | null
) => {
  const API_ALL_ORDERS = 'api/order/all-orders/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy<OrderWithPaginationCustomer>(
      `${process.env.REACT_APP_NGROK}${API_ALL_ORDERS}?page=${page}&page_size=${page_size}${
        search ? `&search=${search}` : ''
      }`,
      'GET',
      {
        Authorization: cookies,
      }
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get<OrderWithPaginationCustomer>(
      `${process.env.REACT_APP_IP_SERVER}${API_ALL_ORDERS}?page=${page}&page_size=${page_size}${
        search ? `&search=${search}` : ''
      }`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  } else {
    return axios.get<OrderWithPaginationCustomer>(
      `http://${hostname}/${API_ALL_ORDERS}?page=${page}&page_size=${page_size}${
        search ? `&search=${search}` : ''
      }`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  }
};
