import axios from 'axios';
import { proxy } from './api';

const API_OPERATIONS = 'api/new-order/operations/';
// const API_OPERATIONS = 'api/new-order/machine/';
const API_ORDERLIST = 'api/new-order/orders/';
const API_OPERATION = 'api/new-order/order-detail/';
const API_WORKPLACE = 'api/new-order/whnet-operations/';

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

export const getOrderViewOrderList = (hostname, cookies, startDate, endDate) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(
      `${process.env.REACT_APP_NGROK}${API_ORDERLIST}?from=${startDate}&to=${endDate}`,
      'GET',
      {
        Authorization: cookies,
      }
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(
      `${process.env.REACT_APP_IP_SERVER}${API_ORDERLIST}?from=${startDate}&to=${endDate}`,
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  } else {
    return axios.get(`http://${hostname}/${API_ORDERLIST}?from=${startDate}&to=${endDate}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getOrderViewOperation = (hostname, cookies, id) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(`${process.env.REACT_APP_NGROK}${API_OPERATION}?operation=${id}`, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_OPERATION}?operation=${id}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_OPERATION}?operation=${id}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getWorkplaceList = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(`${process.env.REACT_APP_NGROK}${API_WORKPLACE}`, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_WORKPLACE}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_WORKPLACE}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
