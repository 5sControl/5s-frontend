import axios from 'axios';

export const url = 'https://a992-134-17-26-206.eu.ngrok.io/';
const PROXY_URL = 'https://5scontrol.pl/proxy_to_ngrok';

export const proxy = <T>(url: string, method: string, headers: any, body?: any) => {
  return axios.post<T>(PROXY_URL, { url, method, headers, body });
};

export const getIsInternet = (URL: string) => {
  return URL.includes('localhost') || URL.includes('com') || URL.includes('app') ? true : false;
};
