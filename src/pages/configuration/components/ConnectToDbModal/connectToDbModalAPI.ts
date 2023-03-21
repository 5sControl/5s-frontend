import axios from 'axios';
import { ConnectionToDatabaseForm } from './types';

export const createConnection = (
  hostname: string,
  cookies: string,
  body: ConnectionToDatabaseForm
) => {
  const CREATE_CONNECTION = 'api/order/create-conection';

  return axios.post(`http://${hostname}/${CREATE_CONNECTION}/`, {
    headers: {
      Authorization: cookies,
    },
    body,
  });
};
