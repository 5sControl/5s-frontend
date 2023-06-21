import axios from 'axios';
import { proxy } from './api';

const API_COMPANYINFO = 'api/company/info/';
const API_COMPANYINFO_FORM = 'api/company/company/';
const API_COMPANY_SUBS_INFO = 'api/company/get_info/';
const API_CREATELICENSE = 'api/company/create_license/';
const API_REGISTRATION = 'api/employees/create/';
const API_AUTH = 'auth/jwt/create/';
const API_USERLIST = 'api/employees/';
const API_VERIFYTOKEN = 'auth/jwt/verify/';
const API_SYSTEMMESSAGE = 'api/core/system-message/';
const API_SUPPLIERS = 'api/suppliers/company/';
const API_COUNTRIES = 'api/suppliers/countries/';

export const authorizationRequest = (hostname, email, password) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: `${process.env.REACT_APP_NGROK + API_AUTH}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(`${process.env.REACT_APP_IP_SERVER}${API_AUTH}`, {
      username: email,
      password: password,
    });
  } else {
    return axios.post(`http://${hostname}/${API_AUTH}`, {
      username: email,
      password: password,
    });
  }
};

export const getCompanyInfo = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_COMPANYINFO, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_COMPANYINFO}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_COMPANYINFO}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getCompanyInfoForm = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_COMPANYINFO_FORM, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_COMPANYINFO_FORM}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_COMPANYINFO_FORM}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const createCompanyInfoForm = (hostname, cookies, data) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_NGROK + API_COMPANYINFO_FORM, 'POST', data, {
      'Content-Type': 'multipart/form-data',
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(`${process.env.REACT_APP_IP_SERVER}${API_COMPANYINFO_FORM}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: cookies,
      },
    });
  } else {
    return axios.post(`http://${hostname}/${API_COMPANYINFO_FORM}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: cookies,
      },
    });
  }
};

export const editCompanyInfoForm = (hostname, cookies, data, id) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.patch(`${process.env.REACT_APP_NGROK + API_COMPANYINFO_FORM}${id}/`, data, {
      headers: {
        'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
        Authorization: cookies,
      },
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.patch(`${process.env.REACT_APP_IP_SERVER}${API_COMPANYINFO_FORM}${id}/`, data, {
      headers: {
        'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
        Authorization: cookies,
      },
    });
  } else {
    return axios.patch(`http://${hostname}/${API_COMPANYINFO_FORM}${id}/`, data, {
      headers: {
        'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
        Authorization: cookies,
      },
    });
  }
};

export const getCompanySubsInfo = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_COMPANY_SUBS_INFO, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_COMPANY_SUBS_INFO}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_COMPANY_SUBS_INFO}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const sendLicenseKey = (hostname, cookies, key) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: `${process.env.REACT_APP_NGROK + API_CREATELICENSE}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify({
        license_key: key,
      }),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(
      `${process.env.REACT_APP_IP_SERVER}${API_CREATELICENSE}`,
      {
        license_key: key,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies,
        },
      }
    );
  } else {
    return axios.post(
      `http://${hostname}/${API_CREATELICENSE}`,
      {
        license_key: key,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies,
        },
      }
    );
  }
};

export const registerNewUser = (hostname, cookies, email, password, role) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: `${process.env.REACT_APP_NGROK + API_REGISTRATION}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify({
        username: email,
        password: password,
        repeat_password: password,
        user_type: role,
      }),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(
      `${process.env.REACT_APP_IP_SERVER}${API_REGISTRATION}`,
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
        },
      }
    );
  } else {
    return axios.post(
      `http://${hostname}/${API_REGISTRATION}`,
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
        },
      }
    );
  }
};

export const getUserList = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_USERLIST, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_USERLIST}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_USERLIST}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const isVerifyToken = (hostname, cookies) => {
  cookies = cookies?.split(' ')[1];
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: `${process.env.REACT_APP_NGROK + API_VERIFYTOKEN}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: cookies,
      }),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(`${process.env.REACT_APP_IP_SERVER}${API_VERIFYTOKEN}`, {
      token: cookies,
    });
  } else {
    return axios.post(`http://${hostname}/${API_VERIFYTOKEN}`, {
      token: cookies,
    });
  }
};

export const getSystemMessage = (hostname, cookies, page) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(`${process.env.REACT_APP_NGROK}${API_SYSTEMMESSAGE}?page=${page}`, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_SYSTEMMESSAGE}?page=${page}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_SYSTEMMESSAGE}?page=${page}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getSuppliers = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(`${process.env.REACT_APP_NGROK}${API_SUPPLIERS}`, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_SUPPLIERS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_SUPPLIERS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const createSuppliers = (hostname, cookies, data) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(`${process.env.REACT_APP_NGROK + API_SUPPLIERS}`, data, {
      headers: {
        'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
        Authorization: cookies,
      },
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(`${process.env.REACT_APP_IP_SERVER}${API_SUPPLIERS}`, data, {
      headers: {
        'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
        Authorization: cookies,
      },
    });
  } else {
    return axios.post(`http://${hostname}/${API_SUPPLIERS}`, data, {
      headers: {
        'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
        Authorization: cookies,
      },
    });
  }
};

export const editSuppliers = (hostname, cookies, id, data) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.patch(`${process.env.REACT_APP_NGROK + API_SUPPLIERS}${id}/`, data, {
      headers: {
        'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
        Authorization: cookies,
      },
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.patch(`${process.env.REACT_APP_IP_SERVER}${API_SUPPLIERS}${id}/`, data, {
      headers: {
        'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
        Authorization: cookies,
      },
    });
  } else {
    return axios.patch(`http://${hostname}/${API_SUPPLIERS}${id}/`, data, {
      headers: {
        'Content-Type': data.logo === null ? 'application/json' : 'multipart/form-data',
        Authorization: cookies,
      },
    });
  }
};

export const deleteSuppliers = (hostname, cookies, id) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.delete(`${process.env.REACT_APP_NGROK + API_SUPPLIERS}${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.delete(`${process.env.REACT_APP_IP_SERVER}${API_SUPPLIERS}${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else {
    return axios.delete(`http://${hostname}/${API_SUPPLIERS}${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  }
};

export const getCountriesList = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_COUNTRIES, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_COUNTRIES}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_COUNTRIES}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
