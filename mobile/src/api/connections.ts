import axios from "axios";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
const API_STATUSDATA = "api/connector/status/";
const API_CONNECTIONS = "api/connector/connections/";
const GET_CONNECTIONS = "api/order/get-connections/";

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const getStatusData = (hostname: string, cookies: string) => {
  return axios.get(constructUrl(API_STATUSDATA), axiosConfig(cookies));
};

export const patchStatusData = (id: number, cookies: string, body: any) => {
  return axios.put(
    constructUrl(`${API_CONNECTIONS}${id}/`),
    body,
    axiosConfig(cookies)
  );
};

export const getConnectionsToDatabases = (
  cookies: string
) => {
  return axios.get(constructUrl(GET_CONNECTIONS), axiosConfig(cookies));
};
