import axios from 'axios';
import { proxy } from '../../../../api/api';
import { ConnectionToDatabaseForm, ConnectResponse } from './types';

export const postConnectionWithDbAPI = (
  hostname: string,
  token: string,
  body: ConnectionToDatabaseForm
) => {
  const CREATE_CONNECTION = 'api/order/create-connection/';

  if (process.env.REACT_APP_ENV === 'proxy') {
    return proxy<ConnectResponse>(
      process.env.REACT_APP_NGROK + CREATE_CONNECTION,
      'POST',
      {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      JSON.stringify(body)
    );
  } else if (process.env.REACT_APP_ENV === 'wify') {
    return axios.post(`${process.env.REACT_APP_IP_SERVER}${CREATE_CONNECTION}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
  } else {
    return axios.post(`${hostname}/${CREATE_CONNECTION}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
  }
};
