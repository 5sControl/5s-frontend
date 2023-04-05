import axios from 'axios';
import { proxy } from '../../../../api/api';
import { OrderWithPaginationCustomer } from '../../../../storage/orderViewCustomer';
import { FilterDataType } from './ordersListSlice';

export const getOrdersAPI = (
  hostname: string,
  cookies: string,
  page: number,
  page_size: number,
  search: string | null,
  params: FilterDataType
) => {
  const API_ALL_ORDERS = 'api/order/all-orders/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    const stringUrl = `${process.env.REACT_APP_NGROK}${API_ALL_ORDERS}`;
    const url = new URL(stringUrl);
    const searchParams = url.searchParams;

    searchParams.append('page', `${page}`);
    searchParams.append('page_size', `${page_size}`);
    search && searchParams.append('search', search);
    searchParams.append('order-status', params['order-status']);
    for (const p of params['operation-status']) {
      searchParams.append('operation-status', p);
    }
    return proxy<OrderWithPaginationCustomer>(url.toString(), 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    const stringUrl = `${process.env.REACT_APP_IP_SERVER}${API_ALL_ORDERS}`;
    const url = new URL(stringUrl);
    const searchParams = url.searchParams;

    searchParams.append('page', `${page}`);
    searchParams.append('page_size', `${page_size}`);
    search && searchParams.append('search', search);
    searchParams.append('order-status', params['order-status']);
    for (const p of params['operation-status']) {
      searchParams.append('operation-status', p);
    }
    return axios.get<OrderWithPaginationCustomer>(url.toString(), {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    const stringUrl = `http://${hostname}/${API_ALL_ORDERS}`;
    const url = new URL(stringUrl);
    const searchParams = url.searchParams;

    searchParams.append('page', `${page}`);
    searchParams.append('page_size', `${page_size}`);
    search && searchParams.append('search', search);
    searchParams.append('order-status', params['order-status']);
    for (const p of params['operation-status']) {
      searchParams.append('operation-status', p);
    }
    return axios.get<OrderWithPaginationCustomer>(url.toString(), {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
