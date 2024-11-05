import axios from "axios";

const API_SCANNER = "api/scanner/";

const axiosConfig = (cookies: string) => ({
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });

export const createOrderFromQr = (qrInfo: string, cookies: string) => {
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${API_SCANNER}`,
      { qr_info: qrInfo },
      axiosConfig(cookies)
    );
};