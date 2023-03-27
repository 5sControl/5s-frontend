import axios from 'axios';

const API_CAMERASELECT = 'api/cameras/';
const API_CAMERACREATE = 'api/cameras/create-camera/';
const API_CAMERAUPDATE = 'api/cameras/update-camera/';
const API_CAMERAFIND = 'find_cameras/';

export const getSelectedCameras = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: process.env.REACT_APP_NGROK + API_CAMERASELECT,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_CAMERASELECT}`, {
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
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(
      process.env.REACT_APP_NGROK + API_CAMERACREATE,
      {
        ip: IPCamera,
        username: username,
        password: password,
        url: process.env.REACT_APP_IP_SERVER,
      },
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(
      `${process.env.REACT_APP_IP_SERVER}${API_CAMERACREATE}`,
      {
        ip: IPCamera,
        username: username,
        password: password,
        url: process.env.REACT_APP_IP_SERVER,
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
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.patch(
      process.env.REACT_APP_NGROK + API_CAMERAUPDATE,
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
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.patch(
      `${process.env.REACT_APP_IP_SERVER}${API_CAMERAUPDATE}`,
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
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.get(process.env.REACT_APP_IP_SERVER + API_CAMERAFIND);
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(process.env.REACT_APP_IP_SERVER + API_CAMERAFIND);
  } else {
    return axios.get(`http://${hostname}/${API_CAMERAFIND}`);
  }
};
