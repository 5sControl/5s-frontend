import axios from 'axios';
import { proxy } from './api';

const API_ALGORITHM = 'api/camera-algorithms/algorithms-detail/';
const API_POSTALGORITHM = 'api/camera-algorithms/create-process/';
const API_GETPROCESS = 'api/camera-algorithms/get-process/';
const API_POSTOPERATIONID = 'api/order/index_stanowisko/';
const API_UPLOAD = 'api/camera-algorithms/upload-algorithm/';

export const getAveilableAlgorithms = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_ALGORITHM}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const uploadAlgorithm = async (hostname, cookies, id) => {
  return axios.post(
    `${process.env.REACT_APP_NGROK}${API_UPLOAD}${id}/`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const postAlgorithnDependences = async (hostname, cookies, response) => {
  return axios.post(
    `${process.env.REACT_APP_NGROK}${API_POSTALGORITHM}`,
    response,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const getProcess = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_GETPROCESS}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const getOperationID = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_POSTOPERATIONID}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const postUploadAlgorithm = async (hostname, cookies, body) => {
  return axios.post(`${process.env.REACT_APP_NGROK}${API_ALGORITHM}`, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const deleteAlgorithmAPI = (hostname, cookies, id) => {
  return axios.delete(`${process.env.REACT_APP_NGROK}${API_ALGORITHM}${id}/`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const putAlgorithmAPI = (cookies, id, body) => {
  console.log(cookies);
  return axios.put(
    `${process.env.REACT_APP_NGROK}${API_ALGORITHM}${id}/`,
    body,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};
