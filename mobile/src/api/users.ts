import axios from "axios";

const API_USERLIST = "api/employees/";
const API_USERINFO = "api/employees/get-user-info/"


export const getUserList = (cookies: string) => {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}${API_USERLIST}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const getCurrentUserInfo = (cookies: string) => {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}${API_USERINFO}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const getUser = (id: number,cookies: string) => {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}${API_USERLIST}${id}/`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const deleteUser = (id: number,cookies: string) => {
  return axios.delete(`${import.meta.env.VITE_API_BASE_URL}${API_USERLIST}${id}/`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const updateUser = (id: number,cookies: string) => {
  return axios.put(`${import.meta.env.VITE_API_BASE_URL}${API_USERLIST}${id}/`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};
