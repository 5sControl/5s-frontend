/* eslint-disable no-unused-vars */
import axios from 'axios';

import { proxy } from './api';

const API_GETREPORTBYID = 'api/reports/by-id/';

export const getData = (hostname, cookies, date, startTime, endTime, algorithm, camera) => {
  let urlString = `api/reports/search_params/?date=${date}&start_time=${startTime}&end_time=${endTime}`;

  if (algorithm && algorithm !== 'algorithm') {
    urlString += `&algorithm=${algorithm}`;
  }
  if (camera && camera !== 'camera') {
    urlString += `&camera__id=${camera}`;
  }

  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(`${process.env.REACT_APP_NGROK + urlString}`, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(process.env.REACT_APP_IP_SERVER + urlString, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname + '/' + urlString}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getReportsById = (hostname, cookies, id) => {
  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(`${process.env.REACT_APP_NGROK}${API_GETREPORTBYID}${id}`, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(`${process.env.REACT_APP_IP_SERVER}${API_GETREPORTBYID}${id}`, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${API_GETREPORTBYID}${id}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
