import axios from 'axios';
import { ConnectionToDatabaseForm } from './types';

export const postConnectionWithDbAPI = (
  hostname: string,
  token: string,
  body: ConnectionToDatabaseForm
) => {
  const CREATE_CONNECTION = 'api/order/create-connection/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: `${process.env.REACT_APP_NGROK}${CREATE_CONNECTION}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    });
  } else {
    return axios.post(`http://${hostname}/${CREATE_CONNECTION}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
  }
};
