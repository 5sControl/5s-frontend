import axios from 'axios';

const API_PRODUCT = 'product-type/';


export const getAllProducts = (categoryId: number, cookies = '') => {
  return axios.get(`${process.env.REACT_APP_MOBILE_API}${API_PRODUCT}${categoryId}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const createProduct = (
  name: string,
  categoryId: number,
  cookies = ''
) => {
  return axios.post(
    `${process.env.REACT_APP_MOBILE_API}${API_PRODUCT}`,
    { name, categoryId },
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const updateProduct = (
  id: number,
  name: string,
  categoryId: number,
  cookies = ''
) => {
  return axios.patch(
    `${process.env.REACT_APP_MOBILE_API}${API_PRODUCT}${id}/`,
    { name, categoryId },
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const deleteProduct = (id: number, cookies = '') => {
  return axios.delete(`${process.env.REACT_APP_MOBILE_API}${API_PRODUCT}${id}/`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};
