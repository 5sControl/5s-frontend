import axios, { AxiosResponse } from 'axios';

const API_AUTH = 'api/auth/jwt/create/';
const API_VERIFYTOKEN = 'api/auth/jwt/verify/';
const API_USERLIST = 'api/employees/';

export const authorizationRequest = (
  hostname: string,
  email: string,
  password: string
): Promise<AxiosResponse> => {
  return axios.post(`${process.env.REACT_APP_NGROK}${API_AUTH}`, {
    username: email,
    password: password,
  });
};

export const isVerifyToken = (hostname: string, cookies: string) => {
  cookies = cookies?.split(' ')[1];
  return axios.post(`${process.env.REACT_APP_NGROK}${API_VERIFYTOKEN}`, {
    token: cookies,
    'ngrok-skip-browser-warning': 'true',
  });
};

export const getUserList = (hostname: string, cookies: string) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_USERLIST}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};
