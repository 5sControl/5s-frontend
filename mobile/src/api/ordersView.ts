import axios from 'axios';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
const API_OPERATIONS = 'api/new-order/operations/';
const API_ORDERLIST = 'api/new-order/orders/';
const API_OPERATION = 'api/new-order/order-detail/';
const API_WORKPLACE = 'api/new-order/whnet-operations/';
const API_FILTRATIONDATA = 'api/new-order/filtration-data';

interface AxiosConfig {
  headers: {
    Authorization: string;
    'ngrok-skip-browser-warning': string;
  };
}

const axiosConfig = (cookies: string): AxiosConfig => ({
  headers: {
    Authorization: cookies,
    'ngrok-skip-browser-warning': 'true',
  },
});

const constructUrl = (endpoint: string): string => `${API_BASE_URL}${endpoint}`;

export const getOrderViewOperations = (cookies: string, startDate: string, endDate: string) => {
  return axios.get(
    constructUrl(`${API_OPERATIONS}?from=${startDate}&to=${endDate}`),
    axiosConfig(cookies)
  );
};

export const getOrderViewOrderList = (cookies: string, startDate: string, endDate: string) => {
  return axios.get(
    constructUrl(`${API_ORDERLIST}?from=${startDate}&to=${endDate}`),
    axiosConfig(cookies)
  );
};

export const getOrderViewOperation = (cookies: string, id: number) => {
  return axios.get(
    constructUrl(`${API_OPERATION}?operation=${id}`),
    axiosConfig(cookies)
  );
};

export const getWorkplaceList = (cookies: string) => {
  return axios.get(constructUrl(API_WORKPLACE), axiosConfig(cookies));
};

export const getFiltrationData = (cookies: string) => {
  return axios.get(constructUrl(API_FILTRATIONDATA), axiosConfig(cookies));
};

export const patchFiltrationData = (cookies: string, body: any) => {
  return axios.put(constructUrl(API_FILTRATIONDATA), body, axiosConfig(cookies));
};