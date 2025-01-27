import axios from "axios";
import { API_BASE_URL } from "../config";

const API_AUTH = "api/auth/jwt/create/";
const API_VERIFYTOKEN = "api/auth/jwt/verify/";

export const authorizationRequest = (email: string, password: string) => {
    return axios.post(`${API_BASE_URL}${API_AUTH}`, {
      username: email,
      password: password,
    });
  };

  export const isVerifyToken = (cookies: string) => {
    cookies = cookies?.split(" ")[1];
    return axios.post(`${API_BASE_URL}${API_VERIFYTOKEN}`, {
      token: cookies,
      "ngrok-skip-browser-warning": "true",
    });
  };