import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_NGROK;
const API_DIRECTORY = "api/erp-reference/reference/";

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const getAllDirectories = (cookies: string) => {
  return axios.get(constructUrl(API_DIRECTORY), axiosConfig(cookies));
};

export const createDirectory = (name: string, is_protected: boolean, cookies: string) => {
  return axios.post(
    constructUrl(API_DIRECTORY),
    { name, is_protected },
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
