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

  return axios.get(process.env.REACT_APP_NGROK + urlString, {
    headers: {
      Authorization: cookies,
    },
  });
};

export const getReportsById = (hostname, cookies, id) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_GETREPORTBYID}${id}`, {
    headers: {
      Authorization: cookies,
    },
  });
};
