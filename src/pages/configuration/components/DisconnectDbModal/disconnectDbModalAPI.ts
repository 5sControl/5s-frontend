import axios from 'axios';
import { getIsInternet, url } from '../../../../api/api';
import { DatabaseInfo } from '../../connectionSlice';

export const createConnection = (hostname: string, cookies: string, body: DatabaseInfo) => {
  const DISCONNECT_CONNECTION = '/api/order/delete-connection/';

  if (getIsInternet(hostname)) {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: `${url}${DISCONNECT_CONNECTION}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
      body: JSON.stringify(body),
    });
  } else {
    return axios.post(`http://${hostname}/${DISCONNECT_CONNECTION}`, {
      headers: {
        Authorization: cookies,
      },
      body,
    });
  }
};
