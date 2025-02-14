import axios from "axios";
import { API_BASE_URL } from "../config";

const API_AUTH = "api/auth/jwt/create/";
const API_VERIFYTOKEN = "api/auth/jwt/verify/";
const API_REQUEST_RESET_PASSWORD = "api/employees/password-reset/"
const API_VERIFY_CODE = "/api/employees/verify-reset-code/"
const API_RESET_PASSWORD = "/api/employees/set-new-password/";

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

  export const requestResetPassword = (email: string, lang: string) => {
    return axios.post(`${API_BASE_URL}${API_REQUEST_RESET_PASSWORD}`, {
      email,
      language_code: lang
    })
  }

  export const verifyCode = (email: string, code: string) => {
    return axios.post(`${API_BASE_URL}${API_VERIFY_CODE}`, {
      email,
      code
    })
  }

  export const resetPassword = (email: string, code: string, newPassword: string, confirmPassword: string) => {
    return axios.post(`${API_BASE_URL}${API_RESET_PASSWORD}`, {
      email,
      code,
      new_password: newPassword,
      confirm_password: confirmPassword
    })
  }