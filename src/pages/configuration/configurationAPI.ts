import axios from 'axios';
import { proxy } from '../../api/api';

export const getConnectionsToDatabases = (hostname: string, cookies: string) => {
  const GET_CONNECTIONS = 'api/order/get-connections/';

  return axios.get(process.env.REACT_APP_NGROK + GET_CONNECTIONS, {
    headers: {
      Authorization: cookies,
    },
  });
};
