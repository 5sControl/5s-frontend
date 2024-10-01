import axios, { AxiosResponse } from 'axios';

const API_PRODUCTCATEGORIES = 'api/erp-reference/product-categories/'

export const getAllProductCategories = (cookies: string) => {
  return axios.get(`${process.env.REACT_APP_NGROK}${API_PRODUCTCATEGORIES}`, {
    headers: {
      Authorization: cookies,
      'ngrok-skip-browser-warning': 'true',
    },
  });
};

export const createProductCategory = (name: string, cookies: string) => {
  return axios.post(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTCATEGORIES}`,
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
  cookies: string
) => {
  return axios.get(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTCATEGORIES}${categoryId}/`,
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
  cookies: string
) => {
  return axios.patch(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTCATEGORIES}${categoryId}/`,
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
  cookies: string
) => {
  return axios.delete(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTCATEGORIES}${categoryId}/`,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};
