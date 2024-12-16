import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_EMPLOYEE = "api/erp-reference/employees/";

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const getAllEmployees = (cookies: string) => {
  return axios.get(constructUrl(API_EMPLOYEE), axiosConfig(cookies));
};

export const getEmployee = (employeeId: number, cookies: string) => {
  return axios.get(
    constructUrl(`${API_EMPLOYEE}${employeeId}/`),
    axiosConfig(cookies)
  );
};