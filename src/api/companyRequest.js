import axios from "axios";
import { url, proxy, getIsInternet } from "./api";

const API_COMPANYINFO = "api/company/info/";
const API_CREATELICENSE = "api/company/create_license/";
const API_REGISTRATION = `register/`;
const API_AUTH = `auth/jwt/create/`;
const API_USERLIST = `api/staff-control/employees/admin/`;
const API_VERIFYTOKEN = "auth/jwt/verify/";
export const authorizationRequest = (hostname, email, password) => {

  if (getIsInternet(hostname)) {
    return axios.post("https://5scontrol.pl/proxy_to_ngrok", {
      url: `${url + API_AUTH}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });
  } else {
    return axios.post(`http://${hostname}/${API_AUTH}`, {
      username: email,
      password: password,
    });
  }
};

export const getCompanyInfo = (hostname, cookies) => {
  if (getIsInternet(hostname)) {
    return proxy(url + API_COMPANYINFO, "GET", {
      Authorization: cookies,
    })
  } else {
    return axios.get(`http://${hostname}/${API_COMPANYINFO}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const sendLicenseKey = (hostname, cookies, key) => {
  if (getIsInternet(hostname)) {
    return axios.post("https://5scontrol.pl/proxy_to_ngrok", {
      url: `${url + API_CREATELICENSE}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: cookies,
      },
      body: JSON.stringify({
        license_key: key,
      }),
    });
  } else {
    return axios.post(
      `http://${hostname}/${API_CREATELICENSE}`,
      {
        license_key: key,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: cookies,
        },
      }
    );
  }
};

export const registerNewUser = (hostname, email, password) => {
  if (getIsInternet(hostname)) {
    axios.post("https://5scontrol.pl/proxy_to_ngrok", {
      url: `${url + API_REGISTRATION}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
        repeat_password: password,
      }),
    });
  } else {
    axios.post(`http://${hostname}/${API_REGISTRATION}`, {
      username: email,
      password: password,
      repeat_password: password,
    });
  }
};

export const getUserList = (hostname, cookies) => {
  if (getIsInternet(hostname)) {
    return proxy(url + API_USERLIST, "GET", {
      Authorization: cookies,
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
  cookies = cookies?.split(' ')[1]
  if (getIsInternet(hostname)) {
   return axios.post("https://5scontrol.pl/proxy_to_ngrok", {
      url: `${url + API_VERIFYTOKEN}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "token": cookies,
      }),
    });
  } else {
    return axios.post(`http://${hostname}/${API_VERIFYTOKEN}`, {
      token: cookies,
    });
  }
};
