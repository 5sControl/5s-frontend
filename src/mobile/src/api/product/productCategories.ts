import axios, { AxiosResponse } from 'axios';

const API_PRODUCTCATEGORIES = 'product-categories/';

export const getAllProductCategories = (cookies = '') => {
  return axios.get(`${process.env.REACT_APP_MOBILE_API}${API_PRODUCTCATEGORIES}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const createProductCategory = (name: string, cookies = '') => {
  return axios.post(
    `${process.env.REACT_APP_MOBILE_API}${API_PRODUCTCATEGORIES}`,
    { name },
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const getProductCategory = (
  categoryId: number,
  cookies = ''
) => {
  return axios.get(
    `${process.env.REACT_APP_MOBILE_API}${API_PRODUCTCATEGORIES}${categoryId}/`,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const updateProductCategory = (
  categoryId: number,
  name: string,
  cookies = ''
) => {
  return axios.patch(
    `${process.env.REACT_APP_MOBILE_API}${API_PRODUCTCATEGORIES}${categoryId}/`,
    { name },
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const deleteProductCategory = (
  categoryId: number,
  cookies = ''
) => {
  return axios.delete(
    `${process.env.REACT_APP_MOBILE_API}${API_PRODUCTCATEGORIES}${categoryId}/`,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};
