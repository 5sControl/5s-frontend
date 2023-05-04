import axios from 'axios';
import { proxy } from './api';

const API_ALGORITHM = 'api/camera-algorithms/algorithms-detail/';
const API_POSTALGORITHM = 'api/camera-algorithms/create-process/';
const API_GETPROCESS = 'api/camera-algorithms/get-process/';
const API_GETLOGS = 'api/camera-algorithms/logs/';
const API_POSTOPERATIONID = 'api/order/index_stanowisko/';

export const getAveilableAlgorithms = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_ALGORITHM, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_ALGORITHM}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_ALGORITHM}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const postAlgorithnDependences = async (hostname, cookies, response) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: process.env.REACT_APP_NGROK + API_POSTALGORITHM,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify(response),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(`${process.env.REACT_APP_IP_SERVER}${API_POSTALGORITHM}`, response, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else {
    return axios.post(`http://${hostname}/${API_POSTALGORITHM}`, response, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  }
};

export const getProcess = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_GETPROCESS, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_GETPROCESS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_GETPROCESS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getLogs = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_GETLOGS, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_GETLOGS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_GETLOGS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getOperationID = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_POSTOPERATIONID, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_POSTOPERATIONID}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_POSTOPERATIONID}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
