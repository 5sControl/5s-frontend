import axios from 'axios';
import { getIsInternet, proxy, url } from '../../api/api';

export const getConnectionsToDatabases = (hostname: string, cookies: string) => {
  const GET_CONNECTIONS = 'api/order/get-connections';

  if (getIsInternet(hostname)) {
    return proxy(url + GET_CONNECTIONS, 'GET', {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname}/${GET_CONNECTIONS}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};
