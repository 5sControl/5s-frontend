import axios from 'axios';

const API_PRODUCTTYPEOPERATION = 'api/erp-reference/product-type-operation/';

export const getAllProductTypeOperations = (
  productTypeId: number,
  cookies = ''
) => {
  return axios.get(
    `${
      process.env.REACT_APP_NGROK
    }${API_PRODUCTTYPEOPERATION}by-type/${productTypeId}`,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const createProductTypeOperation = (
  name: string,
  categoryId: number,
  cookies = ''
) => {
  return axios.post(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTTYPEOPERATION}`,
    { name, categoryId },
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const updateProductTypeOperation = (
  id: number,
  name: string,
  categoryId: number,
  cookies = ''
) => {
  return axios.patch(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTTYPEOPERATION}${id}/`,
    { name, categoryId },
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};

export const deleteProductTypeOperation = (
  id: number,
  cookies = ''
) => {
  return axios.delete(
    `${process.env.REACT_APP_NGROK}${API_PRODUCTTYPEOPERATION}${id}/`,
    {
      headers: {
        Authorization: cookies,
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
};
