import axios from "axios";
import { API_BASE_URL } from "../config";

const API_SCANNER = "api/erp-reference/order-operations/qr-code/";

const axiosConfig = (cookies: string) => ({
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });

export const createOrderFromQr = (body: any, cookies: string) => {
  return axios.post(
      `${API_BASE_URL}${API_SCANNER}`,
      body,
      axiosConfig(cookies)
    ).catch(error => {
      throw error;
  });
};