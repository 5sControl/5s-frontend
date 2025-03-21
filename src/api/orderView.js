import axios from "axios";

const API_OPERATIONS = "api/new-order/operations/";
// const API_OPERATIONS = 'api/new-order/machine/';
const API_ORDERLIST = "api/new-order/orders/";
const API_OPERATION = "api/new-order/order-detail/";
const API_WORKPLACE = "api/new-order/whnet-operations/";
const API_FILTRATIONDATA = "api/new-order/filtration-data";
const API_STATUSDATA = "api/connector/status/";
const API_CONNECTIONS = "api/connector/connections/";

export const getOrderViewOperations = (
  hostname,
  cookies,
  startDate,
  endDate
) => {
  return axios.get(
    `${process.env.REACT_APP_NGROK}${API_OPERATIONS}?from=${startDate}&to=${endDate}`,
    {
      headers: {
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const getOrderViewOrderList = (
  hostname,
  cookies,
  startDate,
  endDate
) => {
  return axios.get(
    `${process.env.REACT_APP_NGROK}${API_ORDERLIST}?from=${startDate}&to=${endDate}`,
    {
      headers: {
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const getOrderViewOperation = (hostname, cookies, id) => {
  return axios.get(
    `${process.env.REACT_APP_NGROK}${API_OPERATION}?operation=${id}`,
    {
      headers: {
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const getWorkplaceList = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_WORKPLACE}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const getFiltrationData = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_FILTRATIONDATA}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const patchFiltrationData = (hostname, cookies, body) => {
  return axios.put(
    `${process.env.REACT_APP_NGROK}${API_FILTRATIONDATA}`,
    body,
    {
      headers: {
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const getStatusData = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_STATUSDATA}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const patchStatusData = (id, cookies, body) => {
  return axios.put(
    `${process.env.REACT_APP_NGROK}${API_CONNECTIONS}${id}/`,
    body,
    {
      headers: {
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
      body,
    }
  );
};
