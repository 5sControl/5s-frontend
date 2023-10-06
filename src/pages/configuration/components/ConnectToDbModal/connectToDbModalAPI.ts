import axios from 'axios';
import { proxy } from '../../../../api/api';
import { ConnectionToDatabaseForm, ConnectResponse } from './types';

export const postConnectionWithDbAPI = (
  hostname: string,
  token: string,
  body: ConnectionToDatabaseForm
) => {
  const CREATE_CONNECTION = 'api/order/create-connection/';

  return axios.post(`${process.env.REACT_APP_NGROK}${CREATE_CONNECTION}`, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
};
