import axios from 'axios';

const ngrokHeaders = {
  'ngrok-skip-browser-warning': 'true',
};

export const getCategoriesApi = () => {
  return axios
    .get(`${process.env.REACT_APP_CHAT_API}getCategories`, { headers: ngrokHeaders })
    .then((res) => res.data);
};

export const getChatsApi = () => {
  return axios
    .get(`${process.env.REACT_APP_CHAT_API}getChats`, { headers: ngrokHeaders })
    .then((res) => res.data);
};

export const getModelsApi = () => {
  return axios
    .get(`${process.env.REACT_APP_CHAT_API}getModels`, { headers: ngrokHeaders })
    .then((res) => res.data);
};

export const getPromptTemplatesApi = () => {
  return axios
    .get(`${process.env.REACT_APP_CHAT_API}getPrompts`, { headers: ngrokHeaders })
    .then((res) => res.data);
};

export const createPromptTemplateApi = (promptTemplate: { title: string; content: string }) => {
  return axios
    .get(
      `${process.env.REACT_APP_CHAT_API}createPrompt?title=${promptTemplate.title}&content=${promptTemplate.content}`,
      { headers: ngrokHeaders }
    )
    .then((res) => res.data);
};

export const editPromptTemplateApi = (promptTemplate: { title: string; content?: string }) => {
  return axios
    .get(
      `${process.env.REACT_APP_CHAT_API}editPrompt?title=${promptTemplate.title}&content=${promptTemplate.content}`,
      { headers: ngrokHeaders }
    )
    .then((res) => res.data);
};

export const removePromptTemplateApi = (title: string) => {
  return axios
    .get(`${process.env.REACT_APP_CHAT_API}editPrompt?title=${title}`, { headers: ngrokHeaders })
    .then((res) => res.data);
};

export const createCategoryApi = (categoryName: string, description: string) => {
  return axios
    .post(
      `${process.env.REACT_APP_CHAT_API}createCategory?name=${categoryName}&description=${description}`,
      null,
      { headers: ngrokHeaders }
    )
    .then((res) => res.data);
};

export const removeCategoryApi = (categoryName: string) => {
  return axios
    .post(`${process.env.REACT_APP_CHAT_API}removeCategory?name=${categoryName}`, null, {
      headers: ngrokHeaders,
    })
    .then((res) => res.data);
};

export const removeCategorySourceApi = (sourceName: string, categoryName: string) => {
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

export const editCategoryApi = (
  oldCategoryName: string,
  categoryName?: string,
  description?: string
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

export const addChatApi = (modelName: string, categoryName?: string) => {
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

export const askChatApi = (chatId: string, prompt: string, categoryName?: string) => {
  return axios
    .get(
      `${process.env.REACT_APP_CHAT_API}ask?chatId=${chatId}&prompt=${prompt}&categoryName=${categoryName}`,
      {
        headers: ngrokHeaders,
      }
    )
    .then((res) => res.data);
};

export const removeChatApi = (chatId: string) => {
  return axios
    .post(`${process.env.REACT_APP_CHAT_API}removeChat?chatId=${chatId}`, null, {
      headers: ngrokHeaders,
    })
    .then((res) => res.data);
};

export const editChatApi = (data: {
  categoryName?: string;
  chatId: string;
  sources?: string[];
  chatName?: string;
  modelName?: string;
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
