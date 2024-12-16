import axios from "axios";

const API_ALGORITHM = "api/camera-algorithms/algorithms-detail/";
const API_POSTALGORITHM = "api/camera-algorithms/create-process/";
const API_GETPROCESS = "api/camera-algorithms/get-process/";
const API_POSTOPERATIONID = "api/order/index_stanowisko/";
const API_UPLOAD = "api/camera-algorithms/upload-algorithm/";

export const getAveilableAlgorithms = (hostname, cookies) => {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}${API_ALGORITHM}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const uploadAlgorithm = async (hostname, cookies, id) => {
  return axios.post(
    `${import.meta.env.VITE_API_BASE_URL}${API_UPLOAD}${id}/`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const postAlgorithnDependences = async (hostname, cookies, response) => {
  return axios.post(
    `${import.meta.env.VITE_API_BASE_URL}${API_POSTALGORITHM}`,
    response,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const getProcess = (hostname, cookies) => {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}${API_GETPROCESS}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const getProcessByCamera = (hostname, cameraIp, cookies) => {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}${API_GETPROCESS}${cameraIp}/`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const getOperationID = (hostname, cookies) => {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}${API_POSTOPERATIONID}`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const postUploadAlgorithm = async (hostname, cookies, body) => {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}${API_ALGORITHM}`, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const deleteAlgorithmAPI = (hostname, cookies, id) => {
  return axios.delete(`${import.meta.env.VITE_API_BASE_URL}${API_ALGORITHM}${id}/`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const putAlgorithmAPI = (cookies, id, body) => {
  return axios.put(
    `${import.meta.env.VITE_API_BASE_URL}${API_ALGORITHM}${id}/`,
    body,
    {
      headers: {
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};
