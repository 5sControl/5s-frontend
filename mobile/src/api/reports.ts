import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_REPORTS = "api/erp-reference/reports/work-hours/";
const ORDERS = 'orders/';
const ORDER_ITEMS = 'order-items/'

const constructUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const getReport = (cookies: string, startDate: string, endDate: string) => {
  return axios.get(constructUrl(`${API_REPORTS}${ORDERS}?startDate=${startDate}&endDate=${endDate}`), {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
    responseType: 'blob'
  });
};

export const getEmployeeReport = (cookies: string, startDate: string, endDate: string, employeeId: number) => {
  return axios.get(constructUrl(`${API_REPORTS}${ORDERS}${employeeId}/?startDate=${startDate}&endDate=${endDate}`), {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
    responseType: 'blob'
  });
};

export const getOrderItemsReport = (cookies: string, startDate: string, endDate: string) => {
  return axios.get(constructUrl(`${API_REPORTS}${ORDER_ITEMS}?startDate=${startDate}&endDate=${endDate}`), {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
    responseType: 'blob'
  });
};