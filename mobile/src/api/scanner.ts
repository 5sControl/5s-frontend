import axios from "axios";

const API_SCANNER = "api/erp-reference/order-operations/qr-code/";

const axiosConfig = (cookies: string) => ({
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });

export const createOrderFromQr = (body: any, cookies: string) => {
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${API_SCANNER}`,
      body,
      axiosConfig(cookies)
    );
};