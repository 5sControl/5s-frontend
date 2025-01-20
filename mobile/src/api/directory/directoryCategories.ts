import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_DIRECTORY = "api/erp-reference/reference-items/";
const REFERENCE = 'reference/';

const axiosConfig = (cookies: string) => ({
  headers: {
    Authorization: cookies,
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const createDirectoryCategory = (name: string, referenceId: number, cookies: string) => {
  return axios.post(
    constructUrl(API_DIRECTORY),
    { name, referenceId },
    axiosConfig(cookies)
  );
};

export const getDirectoryCategory = (referenceId: number, cookies: string) => {
  return axios.get(
    constructUrl(`${API_DIRECTORY}${REFERENCE}${referenceId}/`),
    axiosConfig(cookies)
  );
};

export const updateDirectoryCategory = (
  id: number,
  referenceId: number,
  name: string,
  cookies: string
) => {
  return axios.patch(
    constructUrl(`${API_DIRECTORY}${id}/`),
    { name, referenceId },
    axiosConfig(cookies)
  );
};

export const deleteDirectoryCategory = (id: number, cookies: string) => {
  return axios.delete(
    constructUrl(`${API_DIRECTORY}${id}/`),
    axiosConfig(cookies)
  );
};
