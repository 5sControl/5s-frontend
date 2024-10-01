import axios from 'axios';

const API_STATUSDATA = 'api/connector/status/';
const API_CONNECTIONS = 'api/connector/connections/';
const GET_CONNECTIONS = 'api/order/get-connections/';

export const getStatusData = (hostname: string, cookies: string) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_STATUSDATA}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const patchStatusData = (id: number, cookies: string, body: any) => {
  return axios.put(
    `${process.env.REACT_APP_NGROK}${API_CONNECTIONS}${id}/`,
    body,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const getConnectionsToDatabases = (
  hostname: string,
  cookies: string
) => {
  return axios.get(process.env.REACT_APP_NGROK + GET_CONNECTIONS, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};
