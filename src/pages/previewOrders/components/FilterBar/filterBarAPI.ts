import axios from 'axios';
import { proxy } from '../../../../api/api';
import { OrderWithPaginationCustomer } from '../../../../storage/orderViewCustomer';

export const getFilterOperationsAPI = (hostname: string, cookies: string) => {
  const API_GET_OPERATIONS = 'api/order/get-operations/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    const stringUrl = `${process.env.REACT_APP_NGROK}${API_GET_OPERATIONS}`;
    const url = new URL(stringUrl);

    return proxy<OrderWithPaginationCustomer>(url.toString(), 'GET', {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    const stringUrl = `${process.env.REACT_APP_IP_SERVER}${API_GET_OPERATIONS}`;
    const url = new URL(stringUrl);

    return axios.get<OrderWithPaginationCustomer>(url.toString(), {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    });
  } else {
    const stringUrl = `http://${hostname}/${API_GET_OPERATIONS}`;
    const url = new URL(stringUrl);

    return axios.get<OrderWithPaginationCustomer>(url.toString(), {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    });
  }
};
