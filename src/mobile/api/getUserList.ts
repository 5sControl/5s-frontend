import axios from 'axios';

const API_USERLIST = 'api/employees/';

export const getUserList = (cookies: string) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_USERLIST}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};
