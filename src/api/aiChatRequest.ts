import axios from 'axios';

const ngrokHeaders = {
  'ngrok-skip-browser-warning': 'true',
};

export const getChatCategories = () => {
  return axios
    .get(`${process.env.REACT_APP_CHAT_API}getCategories`, { headers: ngrokHeaders })
    .then((res) => res.data);
};

export const getModels = () => {
  return axios
    .get(`${process.env.REACT_APP_CHAT_API}getModels`, { headers: ngrokHeaders })
    .then((res) => res.data);
};

export const createChatCategory = (categoryName: string, description: string) => {
  return axios
    .post(
      `${process.env.REACT_APP_CHAT_API}createCategory?name=${categoryName}&description=${description}`,
      null,
      { headers: ngrokHeaders }
    )
    .then((res) => res.data);
};

export const removeChatCategory = (categoryName: string) => {
  return axios
    .post(`${process.env.REACT_APP_CHAT_API}removeCategory?name=${categoryName}`, null, {
      headers: ngrokHeaders,
    })
    .then((res) => res.data);
};

export const removeCategorySource = (sourceName: string, categoryName: string) => {
  return axios
    .post(
      `${process.env.REACT_APP_CHAT_API}removeSource?fileName=${sourceName}&categoryName=${categoryName}`,
      null,
      {
        headers: ngrokHeaders,
      }
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
      `${process.env.REACT_APP_CHAT_API}editCategory?oldName=${oldCategoryName}&name=${categoryName}&description=${description}`,
      null,
      {
        headers: ngrokHeaders,
      }
    )
    .then((res) => res.data);
};

export const addChat = (categoryName: string, modelName: string) => {
  return axios
    .post(
      `${process.env.REACT_APP_CHAT_API}createChat?categoryName=${categoryName}&modelName=${modelName}`,
      null,
      {
        headers: ngrokHeaders,
      }
    )
    .then((res) => res.data);
};

export const askChat = (
  chatId: string,
  prompt: string,
  categoryName: string,
  useChain?: string
) => {
  return axios
    .get(
      `${
        process.env.REACT_APP_CHAT_API
      }ask?chatId=${chatId}&prompt=${prompt}&categoryName=${categoryName}${
        useChain && `&useChain=${useChain}`
      }`,
      {
        headers: ngrokHeaders,
      }
    )
    .then((res) => res.data);
};

export const removeChat = (categoryName: string, chatId: string) => {
  return axios
    .post(
      `${process.env.REACT_APP_CHAT_API}removeChat?categoryName=${categoryName}&chatId=${chatId}`,
      null,
      {
        headers: ngrokHeaders,
      }
    )
    .then((res) => res.data);
};

export const editChat = (data: {
  categoryName: string;
  chatId: string;
  sources?: string[];
  chatName?: string;
  modelName: string;
}) => {
  return axios({
    method: 'post',
    url: `${process.env.REACT_APP_CHAT_API}editChat`,
    data,
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
  }).then((res) => res.data);
};

export const uploadSourcesApi = (categoryName: string, data: FormData) => {
  return axios({
    method: 'post',
    url: `${process.env.REACT_APP_CHAT_API}upload?categoryName=${categoryName}`,
    data,
    headers: { 'Content-Type': 'multipart/form-data', 'ngrok-skip-browser-warning': 'true' },
  }).then((res) => res.data);
};

export const downloadFileApi = (categoryName: string, fileName: string) => {
  axios.get(
    `${process.env.REACT_APP_CHAT_API}download?categoryName=${categoryName}&fileName=${fileName}`,
    {
      headers: ngrokHeaders,
      responseType: 'arraybuffer',
    }
  );
};
