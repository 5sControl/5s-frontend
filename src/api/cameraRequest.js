import axios from 'axios';
import { url } from './api';

const API_CAMERASELECT = 'api/cameras/';
const API_CAMERACREATE = 'api/cameras/create-camera/';
const API_CAMERAUPDATE = 'api/cameras/update-camera/';
const API_CAMERAFIND = ':8008/find_cameras/';

export const getSelectedCameras = (hostname, cookies) => {
  if (hostname.includes('localhost')) {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: url + API_CAMERASELECT,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_CAMERASELECT}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  }
};

export const postCamera = (hostname, IPCamera, username, password, cookies) => {
  if (hostname.includes('localhost')) {
    return axios.post(
      url + API_CAMERACREATE,
      {
        ip: IPCamera,
        username: username,
        password: password,
        url: 'http://192.168.1.101',
      },
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  } else {
    return axios.post(
      `http://${hostname}/${API_CAMERACREATE}`,
      {
        ip: IPCamera,
        username: username,
        password: password,
        url: `http://${hostname}`,
      },
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  }
};

export const patchCamera = (hostname, IPCamera, cameraName, cookies) => {
  if (hostname.includes('localhost')) {
    return axios.patch(
      url + API_CAMERAUPDATE,
      {
        ip: IPCamera,
        name: cameraName,
      },
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  } else {
    return axios.patch(
      `http://${hostname}/${API_CAMERAUPDATE}`,
      {
        ip: IPCamera,
        name: cameraName,
      },
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  }
};

export const findCamera = (hostname) => {
  if (hostname) {
    return axios.get('http://192.168.1.101' + API_CAMERAFIND);
  } else {
    axios.get(`http://${hostname + API_CAMERAFIND}`);
  }
};
