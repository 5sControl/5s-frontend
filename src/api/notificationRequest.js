import axios from 'axios';
import { proxy } from './api';

const API_SETTINGS = 'api/mailer/smtp-settings/';
const API_EMAIL = 'api/mailer/emails/';
const API_TASKMANAGER = ':3333/logs?taskId=';
export const getNotificationSettings = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_ENV}${API_SETTINGS}`, {
    headers: {
      Authorization: cookies,
    },
  });
};

export const postNotificationSettings = async (hostname, cookies, response) => {
  return axios.post(`${process.env.REACT_APP_NGROK}${API_SETTINGS}`, response, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookies,
    },
  });
};

export const patchNotificationSettings = (hostname, cookies, response) => {
  return axios.patch(`${process.env.REACT_APP_NGROK}${API_SETTINGS}1/`, response, {
    headers: {
      Authorization: cookies,
    },
  });
};

export const getNotificationEmail = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_EMAIL}`, {
    headers: {
      Authorization: cookies,
    },
  });
};

export const postNotificationEmail = async (hostname, cookies, response) => {
  return axios.post(`${process.env.REACT_APP_NGROK}${API_EMAIL}`, response, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookies,
    },
  });
};

export const patchNotificationEmail = (hostname, cookies, id, email) => {
  return axios.patch(
    `${process.env.REACT_APP_NGROK}${API_EMAIL}${id}/`,
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
};

export const deleteNotificationEmail = (hostname, cookies, id) => {
  return axios.delete(`${process.env.REACT_APP_NGROK}${API_EMAIL}${id}/`, {
    headers: {
      Authorization: cookies,
    },
  });
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
