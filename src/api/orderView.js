import axios from 'axios';
import { proxy } from './api';

const API_OPERATIONS = 'api/new-order/operations/';

export const getOrderViewOperations = (hostname, cookies, startDate, endDate) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(
      `${process.env.REACT_APP_NGROK}${API_OPERATIONS}?from=${startDate}&to=${endDate}`,
      'GET',
      {
        Authorization: cookies,
      }
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(
      `${process.env.REACT_APP_IP_SERVER}${API_OPERATIONS}?from=${startDate}&to=${endDate}`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  } else {
    return axios.get(`http://${hostname}/${API_OPERATIONS}?from=${startDate}&to=${endDate}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
