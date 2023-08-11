import axios from 'axios';
import { proxy } from './api';

const API_SETTINGS = 'api/mailer/smtp-settings/';
const API_EMAIL = 'api/mailer/emails/';
const API_TASKMANAGER = ':3333/logs?taskId=';
export const getNotificationSettings = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_SETTINGS, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_SETTINGS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_SETTINGS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const postNotificationSettings = async (hostname, cookies, response) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: process.env.REACT_APP_NGROK + API_SETTINGS,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify(response),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(`${process.env.REACT_APP_IP_SERVER}${API_SETTINGS}`, response, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else {
    return axios.post(`http://${hostname}/${API_SETTINGS}`, response, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  }
};

export const patchNotificationSettings = (hostname, cookies, response) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(
      process.env.REACT_APP_NGROK + API_SETTINGS + '1/',
      'PATCH',
      {
        Authorization: cookies,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      JSON.stringify({
        response,
      })
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.patch(`${process.env.REACT_APP_IP_SERVER}${API_SETTINGS}1/`, response, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.patch(`http://${hostname}/${API_SETTINGS}1/`, response, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getNotificationEmail = (hostname, cookies) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_EMAIL, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_EMAIL}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_EMAIL}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const postNotificationEmail = async (hostname, cookies, response) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: process.env.REACT_APP_NGROK + API_EMAIL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify(response),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(`${process.env.REACT_APP_IP_SERVER}${API_EMAIL}`, response, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else {
    return axios.post(`http://${hostname}/${API_EMAIL}`, response, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  }
};

export const patchNotificationEmail = (hostname, cookies, id, email) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(
      process.env.REACT_APP_NGROK + API_EMAIL + id + '/',
      'PATCH',
      {
        Authorization: cookies,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      JSON.stringify({
        id: id,
        email: email,
      })
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.patch(
      `${process.env.REACT_APP_IP_SERVER}${API_EMAIL}${id}/`,
      {
        id: id,
        email: email,
      },
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  } else {
    return axios.patch(
      `http://${hostname}/${API_EMAIL}${id}/`,
      {
        id: id,
        email: email,
      },
      {
        headers: {
          Authorization: cookies,
        },
      }
    );
  }
};

export const deleteNotificationEmail = (hostname, cookies, id) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: `${process.env.REACT_APP_NGROK}${API_EMAIL}${id}/`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.delete(`${process.env.REACT_APP_IP_SERVER}${API_EMAIL}${id}/`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.delete(`http://${hostname}/${API_EMAIL}${id}/`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getTaskManager = (hostname, taskId) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + API_TASKMANAGER + taskId, 'GET');
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER.slice(0, -1)}${API_TASKMANAGER}${taskId}`);
  } else {
    return axios.get(`http://${hostname}${API_TASKMANAGER}${taskId}`);
  }
};
