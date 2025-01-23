import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = API_BASE_URL;
const API_EMPLOYEE = "api/erp-reference/employees/";

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${BASE_URL}${endpoint}`;

export const getAllEmployees = (cookies: string) => {
  return axios.get(constructUrl(API_EMPLOYEE), axiosConfig(cookies));
};

export const getEmployee = (employeeId: number, cookies: string) => {
  return axios.get(
    constructUrl(`${API_EMPLOYEE}${employeeId}/`),
    axiosConfig(cookies)
  );
};