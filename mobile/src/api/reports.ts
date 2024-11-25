import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ITEM = "api/erp-reference/reports/work-hours/orders/";

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const getReport = (cookies: string, startDate: string, endDate: string) => {
  return axios.get(constructUrl(`${API_ITEM}?startDate=${startDate}&endDate=${endDate}`), axiosConfig(cookies));
};

export const getEmployeeReport = (cookies: string, startDate: string, endDate: string, employeeId: number) => {
  return axios.get(constructUrl(`${API_ITEM}/${employeeId}?startDate=${startDate}&endDate=${endDate}`), axiosConfig(cookies));
};