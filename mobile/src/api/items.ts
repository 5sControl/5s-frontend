import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = API_BASE_URL;
const API_ITEM = "api/erp-reference/items/";

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${BASE_URL}${endpoint}`;

export const getAllItems = (cookies: string) => {
  return axios.get(constructUrl(API_ITEM), axiosConfig(cookies));
};

export const createItem = (name: string, cookies: string) => {
  return axios.post(
    constructUrl(API_ITEM),
    { name },
    axiosConfig(cookies)
  );
};

export const getItem = (itemId: number, cookies: string) => {
  return axios.get(
    constructUrl(`${API_ITEM}${itemId}/`),
    axiosConfig(cookies)
  );
};

export const updateItem = (
  itemId: number,
  name: string,
  cookies: string
) => {
  return axios.patch(
    constructUrl(`${API_ITEM}${itemId}/`),
    { name },
    axiosConfig(cookies)
  );
};