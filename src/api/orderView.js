import axios from 'axios';
import { proxy } from './api';

const API_OPERATIONS = 'api/new-order/operations/';
// const API_OPERATIONS = 'api/new-order/machine/';
const API_ORDERLIST = 'api/new-order/orders/';
const API_OPERATION = 'api/new-order/order-detail/';
const API_WORKPLACE = 'api/new-order/whnet-operations/';
const API_FILTRATIONDATA = 'api/new-order/filtration-data';
const API_STATUSDATA = 'api/connector/status/';

export const getOrderViewOperations = (hostname, cookies, startDate, endDate) => {
  return axios.get(
    `${process.env.REACT_APP_NGROK}${API_OPERATIONS}?from=${startDate}&to=${endDate}`,
    {
      headers: {
        Authorization: cookies,
      },
    }
  );
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

export const getFiltrationData = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(`${process.env.REACT_APP_NGROK}${API_FILTRATIONDATA}`, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_FILTRATIONDATA}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_FILTRATIONDATA}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const patchFiltrationData = (hostname, cookies, body) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(
      process.env.REACT_APP_NGROK + API_FILTRATIONDATA,
      'PUT',
      {
        Authorization: cookies,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      JSON.stringify(body)
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.put(`${process.env.REACT_APP_IP_SERVER}${API_FILTRATIONDATA}`, body, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.put(`http://${hostname}/${API_FILTRATIONDATA}`, body, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getStatusData = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(`${process.env.REACT_APP_NGROK}${API_STATUSDATA}`, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_STATUSDATA}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_STATUSDATA}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const patchStatusData = (hostname, cookies, body) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(
      process.env.REACT_APP_NGROK + API_STATUSDATA,
      'PUT',
      {
        Authorization: cookies,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      JSON.stringify(body)
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.put(`${process.env.REACT_APP_IP_SERVER}${API_STATUSDATA}`, body, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.put(`http://${hostname}/${API_STATUSDATA}`, body, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
