import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_NGROK;
const API_PRODUCT = "api/erp-reference/product-type/";

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const getAllProducts = (categoryId: number, cookies: string) => {
  return axios.get(
    constructUrl(`${API_PRODUCT}${categoryId}`),
    axiosConfig(cookies)
  );
};

export const createProduct = (
  name: string,
  categoryId: number,
  cookies: string
) => {
  return axios.post(
    constructUrl(API_PRODUCT),
    { name, categoryId },
    axiosConfig(cookies)
  );
};

export const updateProduct = (
  id: number,
  name: string,
  categoryId: number,
  cookies: string
) => {
  return axios.patch(
    constructUrl(`${API_PRODUCT}${id}/`),
    { name, categoryId },
    axiosConfig(cookies)
  );
};

export const deleteProduct = (id: number, cookies: string) => {
  return axios.delete(
    constructUrl(`${API_PRODUCT}${id}/`),
    axiosConfig(cookies)
  );
};
