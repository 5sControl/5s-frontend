import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_NGROK;
const API_PRODUCTOPERATION = 'api/erp-reference/product-operation/';

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    'ngrok-skip-browser-warning': 'true',
  },
});

const constructUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const getAllOperations = (categoryId: number, cookies: string) => {
  return axios.get(constructUrl(`${API_PRODUCTOPERATION}${categoryId}`), axiosConfig(cookies));
};

export const createOperation = (name: string, categoryId: number, cookies: string) => {
  return axios.post(constructUrl(API_PRODUCTOPERATION), { name, categoryId }, axiosConfig(cookies));
};

export const updateOperation = (id: number, name: string, categoryId: number, cookies: string) => {
  return axios.patch(constructUrl(`${API_PRODUCTOPERATION}${id}/`), { name, categoryId }, axiosConfig(cookies));
};

export const deleteOperation = (id: number, cookies: string) => {
  return axios.delete(constructUrl(`${API_PRODUCTOPERATION}${id}/`), axiosConfig(cookies));
};