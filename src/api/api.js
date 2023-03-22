import axios from 'axios';

export const url = 'https://85c1-134-17-26-206.eu.ngrok.io/';

export const proxy = (URL, method, headers, body) => {
  return axios.post('https://5scontrol.pl/proxy_to_ngrok', {
    url: URL,
    method: method,
    headers: headers,
    body: body,
  });
};

export const getIsInternet = (URL) => {
  return URL.includes('localhost') || URL.includes('com') || URL.includes('app') ? true : false;
};
