import axios from 'axios';

export const createConnection = (
  hostname: string,
  cookies: string
  // body: some type
) => {
  const CREATE_CONNECTION = 'api/order/create-conection';

  return axios.post(`http://${hostname}/${CREATE_CONNECTION}/`, {
    headers: {
      Authorization: cookies,
    },
    // body,
  });
};
