import axios from 'axios';
import { proxy } from '../../../api/api';
import { VersionInfoType } from './types';

export const getCompanyVersionAPI = (hostname: string, cookies: string) => {
  const API_VERSION = 'api/company/version/';

  return axios.get<Array<VersionInfoType>>(process.env.REACT_APP_NGROK + API_VERSION, {
    headers: {
      Authorization: cookies,
    },
  });
};
