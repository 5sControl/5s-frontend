import axios from 'axios';

export const url = 'https://c755-134-17-26-206.eu.ngrok.io/';

export const proxy = (URL, method, headers) => {
  return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
    url: URL,
    method: method,
    headers: headers,
  });
};

export const getIsInternet = (URL) => {
  return URL.includes('localhost') || URL.includes('com') || URL.includes('app') ? true : false;
};
