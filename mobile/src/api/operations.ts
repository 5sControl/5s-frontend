import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = API_BASE_URL;
const API_OPERATION = "api/erp-reference/operations/";

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${BASE_URL}${endpoint}`;

export const getAllOperations = (cookies: string) => {
  return axios.get(constructUrl(API_OPERATION), axiosConfig(cookies));
};

export const createOperation = (
  name: string,
  estimatedTime: number = 30,
  estimatedTimeUnit: string = "minutes",
  cookies: string
) => {
  return axios.post(
    constructUrl(API_OPERATION),
    { name, estimatedTime, estimatedTimeUnit },
    axiosConfig(cookies)
  );
};

export const getOperation = (operationId: number, cookies: string) => {
  return axios.get(
    constructUrl(`${API_OPERATION}${operationId}/`),
    axiosConfig(cookies)
  );
};

export const updateOperation = (
  operationId: number,
  name: string,
  estimatedTime: number,
  estimatedTimeUnit: string,
  cookies: string
) => {
  return axios.patch(
    constructUrl(`${API_OPERATION}${operationId}/`),
    { name, estimatedTime, estimatedTimeUnit },
    axiosConfig(cookies)
  );
};