import axios from "axios";
import { API_BASE_URL } from "../../config";

const BASE_URL = API_BASE_URL;
const API_DIRECTORY = "api/erp-reference/references/";
const API_STATIC_DIRECTORY = "api/erp-reference/references/static/";

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${BASE_URL}${endpoint}`;

export const getAllDirectories = (cookies: string) => {
  return axios.get(constructUrl(API_DIRECTORY), axiosConfig(cookies));
};

export const getAllStaticDirectories = (cookies: string) => {
  return axios.get(constructUrl(API_STATIC_DIRECTORY), axiosConfig(cookies));
};

export const createDirectory = (name: string, cookies: string) => {
  return axios.post(
    constructUrl(API_DIRECTORY),
    { name },
    axiosConfig(cookies)
  );
};

export const getDirectory = (directoryId: number, cookies: string) => {
  return axios.get(
    constructUrl(`${API_DIRECTORY}${directoryId}/`),
    axiosConfig(cookies)
  );
};

export const updateDirectory = (
  directoryId: number,
  name: string,
  cookies: string
) => {
  return axios.patch(
    constructUrl(`${API_DIRECTORY}${directoryId}/`),
    { name },
    axiosConfig(cookies)
  );
};

export const deleteDirectory = (directoryId: number, cookies: string) => {
  return axios.delete(
    constructUrl(`${API_DIRECTORY}${directoryId}/`),
    axiosConfig(cookies)
  );
};
