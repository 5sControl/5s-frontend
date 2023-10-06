import axios from 'axios';

export const disconnectDbAPI = (hostname: string, cookies: string, id: number) => {
  const DISCONNECT_CONNECTION = 'api/order/delete-connection/';

  return axios.post(`${process.env.REACT_APP_NGROK}${DISCONNECT_CONNECTION}${id}/`, '', {
    headers: {
      Authorization: cookies,
    },
  });
};
