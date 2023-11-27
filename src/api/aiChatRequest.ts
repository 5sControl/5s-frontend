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

export const removeChatCategory = (categoryName: string) => {
  return axios
    .post(`${process.env.REACT_APP_CHAT_API}removeCategory?name=${categoryName}`)
    .then((res) => res.data);
};

export const removeCategorySource = (sourceName: string, categoryName: string) => {
  return axios
    .post(
      `${process.env.REACT_APP_CHAT_API}removeSource?fileName=${sourceName}&categoryName=${categoryName}`
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

export const addChat = (categoryName: string) => {
  return axios
    .post(`${process.env.REACT_APP_CHAT_API}createChat?categoryName=${categoryName}`)
    .then((res) => res.data);
};

export const removeChat = (categoryName: string, chatId: string) => {
  return axios
    .post(
      `${process.env.REACT_APP_CHAT_API}removeChat?categoryName=${categoryName}&chatId=${chatId}`
    )
    .then((res) => res.data);
};

export const editChat = (data: {
  categoryName: string;
  chatId: string;
  sources?: string[];
  chatName?: string;
}) => {
  return axios({
    method: 'post',
    url: `${process.env.REACT_APP_CHAT_API}editChat`,
    data,
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.data);
};

export const uploadSourcesApi = (categoryName: string, data: FormData) => {
  return axios({
    method: 'post',
    url: `${process.env.REACT_APP_CHAT_API}upload?categoryName=${categoryName}`,
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};
