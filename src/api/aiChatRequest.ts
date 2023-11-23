import axios from 'axios';

export const getChatCategories = () => {
  return axios.get(`${process.env.REACT_APP_CHAT_API}getCategories`).then((res) => res.data);
};

export const createChatCategory = (categoryName: string, description: string) => {
  return axios
    .post(
      `${process.env.REACT_APP_CHAT_API}createCategory?name=${categoryName}&description=${description}`
    )
    .then((res) => res.data);
};

export const editChatCategory = (
  oldCategoryName: string,
  categoryName: string,
  description: string
) => {
  return axios
    .post(
      `${process.env.REACT_APP_CHAT_API}editCategory?oldName=${oldCategoryName}&name=${categoryName}&description=${description}`
    )
    .then((res) => res.data);
};
