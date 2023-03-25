import axios from 'axios';
import { getIsInternet, proxy, url } from '../../../../api/api';
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
  const API_ALL_ORDERS = 'api/order/all-orders';

  if (getIsInternet(hostname)) {
    return proxy<OrderWithPaginationCustomer>(
      `${url}${API_ALL_ORDERS}/?page=${page}&page_size=${page_size}${
        search ? `&search=${search}` : ''
      }`,
      'GET',
      {
        Authorization: cookies,
      }
    );
  } else {
    return axios.get<OrderWithPaginationCustomer>(
      `http://${hostname}/${API_ALL_ORDERS}/?page=${page}&page_size=${page_size}${
        search ? `&${search}` : ''
      }`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  }
};

export const getOrdersByQueryAPI = (hostname: string, cookies: string, query: string) => {
  const API_SEARCH_ORDERS = '/api/order/all-orders/search';

  if (getIsInternet(hostname)) {
    return proxy<OrderListByCustomer[]>(`${url}${API_SEARCH_ORDERS}/?q=${query}`, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get<OrderListByCustomer[]>(`http://${hostname}/${API_SEARCH_ORDERS}/`, {
      headers: {
        Authorization: cookies,
      },
      params: {
        q: query,
      },
    });
  }
};
