import axios from 'axios';

const API_PRODUCTOPERATION = 'product-operation/';

export const getAllOperations = (categoryId: number, cookies = '') => {
  return axios.get(
    `${process.env.REACT_APP_MOBILE_API}${API_PRODUCTOPERATION}${categoryId}`,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const createOperation = (
  name: string,
  categoryId: number,
  cookies = ''
) => {
  return axios.post(
    `${process.env.REACT_APP_MOBILE_API}${API_PRODUCTOPERATION}`,
    { name, categoryId },
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const updateOperation = (
  id: number,
  name: string,
  categoryId: number,
  cookies = ''
) => {
  return axios.patch(
    `${process.env.REACT_APP_MOBILE_API}${API_PRODUCTOPERATION}${id}/`,
    { name, categoryId },
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const deleteOperation = (id: number, cookies = '') => {
  return axios.delete(
    `${process.env.REACT_APP_MOBILE_API}${API_PRODUCTOPERATION}${id}/`,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};
