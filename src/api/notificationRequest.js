import axios from 'axios';
import { proxy } from './api';

const API_SETTINGS = 'api/mailer/smtp-settings/';
const API_EMAIL = 'api/mailer/emails/';
const API_TASKMANAGER = 'api/algorithms/logs?taskId=';

export const getNotificationSettings = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_SETTINGS}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const postNotificationSettings = async (hostname, cookies, response) => {
  return axios.post(`${process.env.REACT_APP_NGROK}${API_SETTINGS}`, response, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const patchNotificationSettings = (hostname, cookies, response) => {
  return axios.patch(
    `${process.env.REACT_APP_NGROK}${API_SETTINGS}1/`,
    response,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const getNotificationEmail = (hostname, cookies) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_EMAIL}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const postNotificationEmail = async (hostname, cookies, response) => {
  return axios.post(`${process.env.REACT_APP_NGROK}${API_EMAIL}`, response, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
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
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const deleteNotificationEmail = (hostname, cookies, id) => {
  return axios.delete(`${process.env.REACT_APP_NGROK}${API_EMAIL}${id}/`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const getTaskManager = (hostname, taskId) => {
  return axios.get(
    `${process.env.REACT_APP_NGROK}${API_TASKMANAGER}${taskId}`,
    {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    }
  );
};
