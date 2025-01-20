import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = API_BASE_URL;
const API_REPORTS = "api/erp-reference/reports/work-hours/";
const ORDERS = 'orders/';
const ORDER_ITEMS = 'order-items/'

const constructUrl = (endpoint: string) => `${BASE_URL}${endpoint}`;

export const getReport = (cookies: string, startDate: string, endDate: string) => {
  return axios.get(constructUrl(`${API_REPORTS}${ORDERS}?startDate=${startDate}&endDate=${endDate}`), {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
    responseType: 'blob'
  });
};

export const getEmployeeReport = (cookies: string, startDate: string, endDate: string, employeeId: string) => {
  return axios.get(constructUrl(`${API_REPORTS}${ORDERS}${employeeId}/?startDate=${startDate}&endDate=${endDate}`), {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
    responseType: 'blob'
  });
};

export const getOrderReport = (cookies: string, startDate: string, endDate: string, orderId: string) => {
  return axios.get(constructUrl(`${API_REPORTS}${ORDER_ITEMS}?startDate=${startDate}&endDate=${endDate}&orderId=${orderId}`), {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
    responseType: 'blob'
  });
};

export const getOrderEmployeeReport = (cookies: string, startDate: string, endDate: string, orderId: string, employeeId: string) => {
  return axios.get(constructUrl(`${API_REPORTS}${ORDER_ITEMS}${employeeId}/?startDate=${startDate}&endDate=${endDate}&orderId=${orderId}`), {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
    responseType: 'blob'
  });
};
