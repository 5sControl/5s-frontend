import axios from "axios";
import { IAddUser, IUser } from "../models/interfaces/employee.interface";

const API_USERLIST = "api/employees/";
const API_USERINFO = "api/employees/get-user-info/"
const API_USER_ADD = "api/employees/create/"
const API_WORKPLACES = "api/employees/workplaces/";


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

export const updateUser = (id: number, user: Partial<IAddUser>, cookies: string) => {
  return axios.put(`${import.meta.env.VITE_API_BASE_URL}${API_USERLIST}${id}/`,
    user,
    {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const createUser = (user: IAddUser, cookies: string) => {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}${API_USER_ADD}`,
    user,
    {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const getWorkplaces = (cookies: string) => {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}${API_WORKPLACES}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};
