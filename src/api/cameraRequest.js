import axios from "axios";
import { proxy } from "./api";

const API_CAMERASELECT = "api/camera-algorithms/camera/";
const API_CAMERACREATE = "api/cameras/create-camera/";
const API_CAMERADELETE = "api/camera-algorithms/delete-camera/";
const API_CAMERAFIND = "api/core/find_cameras/";
const API_CAMERACHECK = "api/cam-stream/cameras/verification";
const API_CAMERAZONES = "api/camera-algorithms/zone-cameras/";
const API_ZONES = "api/camera-algorithms/zone/";
const API_ALGORITHMZONES = "api/camera-algorithms/zones-algorithms/";
const API_VIDEO = "api/cam-stream/videos/availability";

export const getSelectedCameras = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_CAMERASELECT}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const postCamera = (hostname, IPCamera, username, password, cookies) => {
  return axios.post(
    `${process.env.REACT_APP_PROXY}${API_CAMERACREATE}`,
    {
      ip: IPCamera,
      username: username,
      password: password,
      url: "http://192.168.1.110",
    },
    {
      headers: {
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const deleteCameraAPI = (hostname, cookies, IPCamera) => {
  return axios.delete(
    `${process.env.REACT_APP_NGROK}${API_CAMERADELETE}${IPCamera}/`,
    {
      headers: {
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const findCamera = (hostname) => {
  return axios.get(process.env.REACT_APP_NGROK + API_CAMERAFIND, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const checkCamera = (hostname, cameraIP, username, password) => {
  return fetch(`${process.env.REACT_APP_NGROK}${API_CAMERACHECK}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({
      ip: cameraIP,
      username: username,
      password: password,
    }),
  });
};

export const getCameraZones = (hostname, cookies, camera) => {
  return axios.get(
    `${process.env.REACT_APP_NGROK}${API_CAMERAZONES}?camera=${camera}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const postCameraZones = (hostname, cookies, body) => {
  return axios.post(`${process.env.REACT_APP_NGROK}${API_ZONES}`, body, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const patchCameraZones = (hostname, cookies, response, id) => {
  return axios.put(
    `${process.env.REACT_APP_NGROK}${API_ZONES}${id}/`,
    response,
    {
      headers: {
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const deleteCameraZones = (hostname, cookies, id) => {
  return axios.delete(`${process.env.REACT_APP_NGROK}${API_ZONES}${id}/`, {
    headers: {
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const getAlgorithmZones = (hostname, cookies, camera) => {
  return axios.get(
    `${process.env.REACT_APP_NGROK}${API_ALGORITHMZONES}?camera=${camera}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: cookies,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};

export const getVideo = (hostname, body) => {
  const {time, camera_ip} = body;
  return axios.get(`${process.env.REACT_APP_NGROK}${API_VIDEO}?time=${time}&cameraIp=${camera_ip}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export const getSelectedZone = (hostname, cookies, id) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_ZONES}${id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: cookies,
      "ngrok-skip-browser-warning": "true",
    },
  });
};
