import axios from 'axios';
import { proxy } from './api';

const API_COMPANYINFO = 'api/company/info/';
const API_COMPANY_SUBS_INFO = 'api/company/get_info/';
const API_CREATELICENSE = 'api/company/create_license/';
const API_REGISTRATION = 'api/employees/create/';
const API_AUTH = 'auth/jwt/create/';
const API_USERLIST = 'api/employees/';
const API_VERIFYTOKEN = 'auth/jwt/verify/';
const API_SYSTEMMESSAGE = 'api/core/system-message/';

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
