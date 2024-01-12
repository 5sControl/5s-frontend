import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addChatApi,
  askChatApi,
  createCategoryApi,
  editChatApi,
  editCategoryApi,
  getCategoriesApi,
  getModelsApi,
  removeCategorySourceApi,
  removeChatApi,
  removeCategoryApi,
  uploadSourcesApi,
  getChatsApi,
  getPromptTemplatesApi,
  createPromptTemplateApi,
  editPromptTemplateApi,
  removePromptTemplateApi,
} from '../../api/aiChatRequest';
import { AppDispatch } from '../../store';

interface PromptTemplate {
  title: string;
  content: string;
}

interface SourceData {
  name: string;
  date: string;
}

interface FetchedCategories {
  name: string;
  description: string;
  categoryContent: {
    links: SourceData[];
    files: Array<SourceData & { size: number }>;
  };
}

interface Category {
  name: string;
  description: string;
  categoryContent: {
    links: SourceData[];
    files: Array<SourceData & { size: number }>;
  };
  processingSources: {
    links: SourceData[];
    files: Array<SourceData & { size: number }>;
  };
}

export interface Chat {
  id: string;
  name: string;
  categoryName: string;
  promptTemplateTitle?: string;
  modelName: string;
  sources: string[];
  history: {
    author: 'chat' | 'user';
    message: string;
    mentionedRCFiles?: string[];
  }[];
}

interface AIChat {
  isLoading: boolean;
  categories: Category[];
  availableModels: string[];
  selectedChat: Chat;
  chats: Chat[];
  messageToSpeak: string;
  promptTemplates: PromptTemplate[];
}

const initialState: AIChat = {
  isLoading: false,
  categories: [],
  availableModels: [],
  selectedChat: {} as Chat,
  chats: [],
  messageToSpeak: '',
  promptTemplates: [],
};

export const fetchCategoriesAction = () => async (dispatch: AppDispatch) => {
  dispatch(aiChatPage.actions.setLoading(true));
  try {
    const data = await getCategoriesApi();
    dispatch(aiChatPage.actions.setCategories(data));
  } catch {
    console.log('error fetching categories');
  } finally {
    dispatch(aiChatPage.actions.setLoading(false));
  }
};

export const fetchChatsAction = () => async (dispatch: AppDispatch) => {
  dispatch(aiChatPage.actions.setLoading(true));
  try {
    const data = await getChatsApi();
    dispatch(aiChatPage.actions.setChats(data));
  } catch {
    console.log('error fetching categories');
  } finally {
    dispatch(aiChatPage.actions.setLoading(false));
  }
};
export const fetchPromptTemplatesAction = () => async (dispatch: AppDispatch) => {
  dispatch(aiChatPage.actions.setLoading(true));
  try {
    const data = await getPromptTemplatesApi();
    dispatch(aiChatPage.actions.setPromptTemplates(data));
  } catch {
    console.log('error fetching categories');
  } finally {
    dispatch(aiChatPage.actions.setLoading(false));
  }
};

export const fetchAvailableModelsAction = () => async (dispatch: AppDispatch) => {
  dispatch(aiChatPage.actions.setLoading(true));
  try {
    const data = await getModelsApi();
    dispatch(aiChatPage.actions.setModels(data));
  } catch {
    console.log('error fetching categories');
  } finally {
    dispatch(aiChatPage.actions.setLoading(false));
  }
};

export const createPromptTemplateAction =
  (promptTemplate: { title: string; content: string }) => async (dispatch: AppDispatch) => {
    try {
      const data = await createPromptTemplateApi(promptTemplate);
      dispatch(aiChatPage.actions.setPromptTemplates(data));
    } catch {
      console.log('error creating category');
    }
  };

export const editPromptTemplateAction =
  (promptTemplate: { oldTitle: string; title?: string; content?: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const data = await editPromptTemplateApi(promptTemplate);
      dispatch(aiChatPage.actions.setPromptTemplates(data));
    } catch {
      console.log('error creating category');
    }
  };

export const removePromptTemplateAction = (title: string) => async (dispatch: AppDispatch) => {
  try {
    const data = await removePromptTemplateApi(title);
    dispatch(aiChatPage.actions.setPromptTemplates(data));
  } catch {
    console.log('error creating category');
  }
};

export const createCategoryAction =
  (categoryName: string, categoryDescription: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await createCategoryApi(categoryName, categoryDescription);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error creating category');
    }
  };

export const removeCategoryAction = (categoryName: string) => async (dispatch: AppDispatch) => {
  try {
    const data = await removeCategoryApi(categoryName);
    dispatch(aiChatPage.actions.setCategories(data));
  } catch {
    console.log('error removing category');
  }
};

export const editCategoryAction =
  (oldCategoryName: string, categoryName: string, description: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const data = await editCategoryApi(oldCategoryName, categoryName, description);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error editing category');
    }
  };

export const removeCategorySourceAction =
  (fileName: string, categoryName: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await removeCategorySourceApi(fileName, categoryName);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error removing category source');
    }
  };

export const addChatAction = (modelName: string) => async (dispatch: AppDispatch) => {
  try {
    const data = await addChatApi(modelName);
    dispatch(aiChatPage.actions.setChats(data));
  } catch {
    console.log('error adding chat');
  }
};

export const removeChatAction =
  (categoryName: string, chatId: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await removeChatApi(chatId);
      dispatch(aiChatPage.actions.setChats(data));
    } catch {
      console.log('error removing chat');
    }
  };

export const editChatSourcesAction =
  (categoryName: string, chatId: string, sources: string[], modelName?: string) =>
  (dispatch: AppDispatch) => {
    dispatch(aiChatPage.actions.setChatSources({ chatId, sources, modelName }));
  };

export const setSelectedChatAction = (chat: Chat) => (dispatch: AppDispatch) => {
  dispatch(aiChatPage.actions.setSelectedChat(chat));
};

export const editChatAction =
  (payloadData: {
    categoryName?: string;
    chatId: string;
    sources?: string[];
    chatName?: string;
    modelName?: string;
    promptTemplateTitle?: string;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      const data = await editChatApi(payloadData);
      dispatch(aiChatPage.actions.setChats(data));
    } catch {
      console.log('error editing chat');
    }
  };

export const askChatAction =
  (chatId: string, prompt: string, categoryName: string, promptTemplateTitle?: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(aiChatPage.actions.setLoading(true));
    try {
      const data = await askChatApi(chatId, prompt, categoryName, promptTemplateTitle);
      const currentChatData = data.find((chat: Chat) => chat.id === chatId);
      dispatch(aiChatPage.actions.setChats(data));
      dispatch(aiChatPage.actions.setMessageToSpeak(currentChatData.history.at(-1).message));
    } catch {
      console.log('error asking chat');
    } finally {
      dispatch(aiChatPage.actions.setLoading(false));
    }
  };

export const uploadSourceAction =
  (categoryName: string, formData: FormData) => async (dispatch: AppDispatch) => {
    try {
      const fileToLoad = formData.get('file') as File;
      const processingFileName = fileToLoad ? fileToLoad.name : '';
      const processingFileSize = fileToLoad ? fileToLoad.size : 0;
      const linkToLoad =
        formData.get('link') === null ? undefined : (formData.get('link') as string);
      dispatch(
        aiChatPage.actions.addUploadingFiles({
          categoryName,
          filename: processingFileName,
          link: linkToLoad,
          fileSize: processingFileSize,
        })
      );
      const data = await uploadSourcesApi(categoryName, formData);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error uploading categories');
    }
  };

const aiChatPage = createSlice({
  name: 'ai-chat',
  initialState,
  reducers: {
    setPromptTemplates(state: AIChat, action: PayloadAction<PromptTemplate[]>) {
      state.promptTemplates = action.payload;
    },
    setModels(state: AIChat, action: PayloadAction<string[]>) {
      state.availableModels = action.payload;
    },
    setMessageToSpeak(state: AIChat, action: PayloadAction<string>) {
      state.messageToSpeak = action.payload;
    },
    setCategories(state: AIChat, action: PayloadAction<FetchedCategories[]>) {
      state.categories = action.payload.map((category) => {
        return {
          ...category,
          processingSources: {
            links: [],
            files: [],
          },
        };
      });
      console.log(state.categories);
    },
    setChats(state: AIChat, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
      if (state.selectedChat) {
        const updatedSelectedChat = action.payload.find(
          (chat) => chat.id === state.selectedChat.id
        );
        if (updatedSelectedChat) {
          state.selectedChat = updatedSelectedChat;
        }
      }
    },
    setLoading(state: AIChat, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSelectedChat(state: AIChat, action: PayloadAction<Chat>) {
      state.selectedChat = action.payload;
    },
    setChatSources(
      state: AIChat,
      action: PayloadAction<{
        chatId: string;
        sources: string[];
        modelName?: string;
      }>
    ) {
      const selectedChat = state.chats.find((chat) => chat.id === action.payload.chatId);
      if (selectedChat) {
        selectedChat.sources = action.payload.sources;
      }
    },
    addUploadingFiles(
      state: AIChat,
      action: PayloadAction<{
        categoryName: string;
        filename?: string;
        link?: string;
        fileSize: number;
      }>
    ) {
      const currentCategory = state.categories.find(
        (cat) => cat.name === action.payload.categoryName
      );
      const date = new Date();
      if (action.payload.filename) {
        currentCategory?.processingSources.files.unshift({
          name: action.payload.filename,
          date: `${date.getDate()}.${date.getUTCMonth()}.${date.getFullYear()}`,
          size: action.payload.fileSize,
        });
      }
      if (action.payload.link) {
        currentCategory?.processingSources.links.unshift({
          name: action.payload.link,
          date: `${date.getDate()}.${date.getUTCMonth()}.${date.getFullYear()}`,
        });
      }
    },
  },
});

export default aiChatPage.reducer;
