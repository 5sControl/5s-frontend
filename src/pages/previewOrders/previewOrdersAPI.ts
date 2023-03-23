import axios from 'axios';
import { getIsInternet, proxy, url } from '../../api/api';
import { OrderRequest, OrderWithPaginationCustomer } from '../../storage/orderViewCustomer';

export const getOrderData = (hostname: string, cookies: string, orderId: string) => {
  const API_BY_ORDER = 'api/order/by-order';

  if (getIsInternet(hostname)) {
    return proxy<OrderRequest>(`${url}${API_BY_ORDER}/${orderId}/`, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname}/${API_BY_ORDER}/${orderId}/`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getOrdersId = (hostname: string, cookies: string, page?: number) => {
  const API_ALL_ORDERS = 'api/order/all-orders';

  if (getIsInternet(hostname)) {
    return proxy<OrderWithPaginationCustomer>(
      `${url}${API_ALL_ORDERS}/${page ? `?page=${page}` : ''}`,
      'GET',
      {
        Authorization: cookies,
      }
    );
  } else {
    return axios.get<OrderWithPaginationCustomer>(
      `http://${hostname}/${API_ALL_ORDERS}/${page ? `?page=${page}` : ''}`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  }
};
