import axios from "axios";

const API_USERLIST = "api/employees/";
const API_USERINFO = "api/employees/get-user-info/"


export const getUserList = (cookies: string) => {
  return axios.get(`${import.meta.env.VITE_NGROK}${API_USERLIST}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const getUserInfo = (cookies: string) => {
  return axios.get(`${import.meta.env.VITE_NGROK}${API_USERINFO}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};
