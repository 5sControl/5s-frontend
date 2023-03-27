import axios from 'axios';
import { ConnectionToDatabaseForm } from './types';

export const postConnectionWithDbAPI = (
  hostname: string,
  token: string,
  body: ConnectionToDatabaseForm
) => {
  const CREATE_CONNECTION = 'api/order/create-connection/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post(process.env.REACT_APP_PROXY, {
      url: `${process.env.REACT_APP_NGROK}${CREATE_CONNECTION}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(`${process.env.REACT_APP_IP_SERVER}${CREATE_CONNECTION}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
  } else {
    return axios.post(`${hostname}${CREATE_CONNECTION}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
  }
};
