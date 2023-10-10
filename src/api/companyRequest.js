import axios from 'axios';
import { proxy } from './api';

const API_COMPANYINFO = 'api/company/info/';
const API_COMPANYINFO_FORM = 'api/company/company/';
const API_COMPANY_SUBS_INFO = 'api/company/get_info/';
const API_CREATELICENSE = 'api/company/create_license/';
const API_REGISTRATION = 'api/employees/create/';
const API_AUTH = 'api/auth/jwt/create/';
const API_USERLIST = 'api/employees/';
const API_VERIFYTOKEN = 'api/auth/jwt/verify/';
const API_SYSTEMMESSAGE = 'api/core/system-message/';
const API_SUPPLIERS = 'api/suppliers/company/';
const API_COUNTRIES = 'api/suppliers/countries/';

export const authorizationRequest = (hostname, email, password) => {
  return axios.post(`${process.env.REACT_APP_NGROK}${API_AUTH}`, {
    username: email,
    password: password,
  });
};

export const getCompanyInfo = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_COMPANYINFO}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const getCompanyInfoForm = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_COMPANYINFO_FORM}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const createCompanyInfoForm = (hostname, cookies, data) => {
  return axios.post(`${process.env.REACT_APP_NGROK}${API_COMPANYINFO_FORM}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const editCompanyInfoForm = (hostname, cookies, data, id) => {
  return axios.patch(`${process.env.REACT_APP_NGROK}${API_COMPANYINFO_FORM}${id}/`, data, {
    headers: {
      'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const getCompanySubsInfo = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_COMPANY_SUBS_INFO}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const sendLicenseKey = (hostname, cookies, key) => {
  return axios.post(
    `${process.env.REACT_APP_NGROK}${API_CREATELICENSE}`,
    {
      license_key: key,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const registerNewUser = (hostname, cookies, email, password, role) => {
  return axios.post(
    `${process.env.REACT_APP_NGROK}${API_REGISTRATION}`,
    {
      username: email,
      password: password,
      repeat_password: password,
      user_type: role,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const getUserList = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_USERLIST}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const isVerifyToken = (hostname, cookies) => {
  cookies = cookies?.split(' ')[1];
  return axios.post(`${process.env.REACT_APP_NGROK}${API_VERIFYTOKEN}`, {
    token: cookies,
    'ngrok-skip-browser-warning': 'true',
  });
};

export const getSystemMessage = (hostname, cookies, page) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_SYSTEMMESSAGE}?page=${page}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const getSuppliers = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_SUPPLIERS}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const createSuppliers = (hostname, cookies, data) => {
  return axios.post(`${process.env.REACT_APP_NGROK}${API_SUPPLIERS}`, data, {
    headers: {
      'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const editSuppliers = (hostname, cookies, id, data) => {
  return axios.patch(`${process.env.REACT_APP_NGROK}${API_SUPPLIERS}${id}/`, data, {
    headers: {
      'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const deleteSuppliers = (hostname, cookies, id) => {
  return axios.delete(`${process.env.REACT_APP_NGROK}${API_SUPPLIERS}${id}/`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const getCountriesList = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_COUNTRIES}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};
