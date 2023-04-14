import axios from 'axios';
import { proxy } from '../../../../api/api';
import { OrderWithPaginationCustomer } from '../../../../storage/orderViewCustomer';
import { FilterDataParams } from './ordersListSlice';

export const getOrdersAPI = (
  hostname: string,
  cookies: string,
  page: number,
  page_size: number,
  search: string | null,
  params: FilterDataParams
) => {
  const API_ALL_ORDERS = 'api/order/all-orders/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    const stringUrl = `${process.env.REACT_APP_NGROK}${API_ALL_ORDERS}`;
    const url = new URL(stringUrl);
    const searchParams = url.searchParams;

    searchParams.append('page', `${page}`);
    searchParams.append('page_size', `${page_size}`);
    search && searchParams.append('search', search);
    if (params['order-status']) {
      searchParams.append('order-status', params['order-status']);
    }
    if (params['from']) {
      searchParams.append('from', params['from']);
    }
    if (params['to']) {
      searchParams.append('to', params['to']);
    }
    if (params['operation-status']) {
      for (const p of params['operation-status']) {
        searchParams.append('operation-status', p);
      }
    }
    if (params['operation-name']) {
      for (const p of params['operation-name']) {
        searchParams.append('operation-name', p.toLocaleLowerCase());
      }
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
    if (params['from']) {
      searchParams.append('from', params['from']);
    }
    if (params['to']) {
      searchParams.append('to', params['to']);
    }
    for (const p of params['operation-status']) {
      searchParams.append('operation-status', p);
    }
    for (const p of params['operation-name']) {
      searchParams.append('operation-name', p.toLocaleLowerCase());
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
    if (params['from']) {
      searchParams.append('from', params['from']);
    }
    if (params['to']) {
      searchParams.append('to', params['to']);
    }
    for (const p of params['operation-status']) {
      searchParams.append('operation-status', p);
    }
    for (const p of params['operation-name']) {
      searchParams.append('operation-name', p.toLocaleLowerCase());
    }

    return axios.get<OrderWithPaginationCustomer>(url.toString(), {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
