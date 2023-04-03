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
    return proxy<OrderWithPaginationCustomer>(
      `${process.env.REACT_APP_NGROK}${API_ALL_ORDERS}`,
      'GET',
      {
        Authorization: cookies,
        params: {
          page,
          page_size,
          search,
          'order-status': params['order-status'],
        },
      }
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get<OrderWithPaginationCustomer>(
      `${process.env.REACT_APP_IP_SERVER}${API_ALL_ORDERS}`,
      {
        headers: {
          Authorization: cookies,
        },
        params: {
          page,
          page_size,
          search,
          'order-status': params['order-status'],
        },
      }
    );
  } else {
    return axios.get<OrderWithPaginationCustomer>(`http://${hostname}/${API_ALL_ORDERS}`, {
      headers: {
        Authorization: cookies,
      },
      params: {
        page,
        page_size,
        search,
        'order-status': params['order-status'],
      },
    });
  }
};
