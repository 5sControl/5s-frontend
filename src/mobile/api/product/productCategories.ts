import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_NGROK;
const API_PRODUCTCATEGORIES = 'api/erp-reference/product-categories/';

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    'ngrok-skip-browser-warning': 'true',
  },
});

const constructUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const getAllProductCategories = (cookies: string) => {
  return axios.get(constructUrl(API_PRODUCTCATEGORIES), axiosConfig(cookies));
};

export const createProductCategory = (name: string, cookies: string) => {
  return axios.post(constructUrl(API_PRODUCTCATEGORIES), { name }, axiosConfig(cookies));
};

export const getProductCategory = (categoryId: number, cookies: string) => {
  return axios.get(constructUrl(`${API_PRODUCTCATEGORIES}${categoryId}/`), axiosConfig(cookies));
};

export const updateProductCategory = (categoryId: number, name: string, cookies: string) => {
  return axios.patch(constructUrl(`${API_PRODUCTCATEGORIES}${categoryId}/`), { name }, axiosConfig(cookies));
};

export const deleteProductCategory = (categoryId: number, cookies: string) => {
  return axios.delete(constructUrl(`${API_PRODUCTCATEGORIES}${categoryId}/`), axiosConfig(cookies));
};