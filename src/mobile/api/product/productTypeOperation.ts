import axios from 'axios';

const API_BASE_URL: string = process.env.REACT_APP_NGROK;
const API_PRODUCTTYPEOPERATION = 'api/erp-reference/product-type-operation/';

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    'ngrok-skip-browser-warning': 'true',
  },
});

const constructUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const getAllProductTypeOperations = (productTypeId: number, cookies: string) => {
  return axios.get(constructUrl(`${API_PRODUCTTYPEOPERATION}by-type/${productTypeId}`), axiosConfig(cookies));
};

export const createProductTypeOperation = (name: string, categoryId: number, cookies: string) => {
  return axios.post(constructUrl(API_PRODUCTTYPEOPERATION), { name, categoryId }, axiosConfig(cookies));
};

export const updateProductTypeOperation = (id: number, name: string, categoryId: number, cookies: string) => {
  return axios.patch(constructUrl(`${API_PRODUCTTYPEOPERATION}${id}/`), { name, categoryId }, axiosConfig(cookies));
};

export const deleteProductTypeOperation = (id: number, cookies: string) => {
  return axios.delete(constructUrl(`${API_PRODUCTTYPEOPERATION}${id}/`), axiosConfig(cookies));
};