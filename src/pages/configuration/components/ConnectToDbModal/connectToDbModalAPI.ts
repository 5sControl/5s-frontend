import axios from 'axios';
import { getIsInternet, url } from '../../../../api/api';
import { ConnectionToDatabaseForm } from './types';

export const postConnectionWithDbAPI = (
  hostname: string,
  token: string,
  body: ConnectionToDatabaseForm
) => {
  const CREATE_CONNECTION = 'api/order/create-connection/';

  if (getIsInternet(hostname)) {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: `${url}${CREATE_CONNECTION}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    });
  } else {
    return axios.post(`http://${hostname}/${CREATE_CONNECTION}`, {
      headers: {
        Authorization: token,
      },
      body,
    });
  }
};
