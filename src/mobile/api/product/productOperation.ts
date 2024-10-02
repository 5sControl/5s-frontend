import axios from 'axios';

const API_PRODUCTOPERATION = 'api/erp-reference/product-operation/'

export const getAllOperations = (categoryId: number, cookies: string ) => {
  return axios.get(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTOPERATION}${categoryId}`,
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
  cookies : string
) => {
  return axios.post(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTOPERATION}`,
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
  cookies: string 
) => {
  return axios.patch(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTOPERATION}${id}/`,
    { name, categoryId },
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const deleteOperation = (id: number, cookies: string ) => {
  return axios.delete(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTOPERATION}${id}/`,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};
