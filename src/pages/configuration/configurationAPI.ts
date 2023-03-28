import axios from 'axios';
import { proxy } from '../../api/api';

export const getConnectionsToDatabases = (hostname: string, cookies: string) => {
  const GET_CONNECTIONS = 'api/order/get-connections/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy(process.env.REACT_APP_NGROK + GET_CONNECTIONS, 'GET', {
      Authorization: cookies,
    });
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.get(process.env.REACT_APP_IP_SERVER + GET_CONNECTIONS, {
      headers: {
        Authorization: cookies,
      },
    });
  } else {
    return axios.get(`http://${hostname}/${GET_CONNECTIONS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
