import axios from 'axios';
import { getIsInternet, url } from '../../../../api/api';

export const disconnectDbAPI = (hostname: string, cookies: string, id: number) => {
  const DISCONNECT_CONNECTION = 'api/order/delete-connection/';

  if (getIsInternet(hostname)) {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: `${url}${DISCONNECT_CONNECTION}${id}/`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookies,
      },
    });
  } else {
    return axios.post(`http://${hostname}/${DISCONNECT_CONNECTION}${id}/`, '', {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
