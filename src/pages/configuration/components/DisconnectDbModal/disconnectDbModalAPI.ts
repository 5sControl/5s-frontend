import axios from 'axios';

export const disconnectDbAPI = (hostname: string, cookies: string, id: number) => {
  const DISCONNECT_CONNECTION = 'api/order/delete-connection/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
      url: `${process.env.REACT_APP_NGROK}${DISCONNECT_CONNECTION}${id}/`,
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
