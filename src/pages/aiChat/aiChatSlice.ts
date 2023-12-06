import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addChat,
  askChat,
  createChatCategory,
  editChat,
  editChatCategory,
  getChatCategories,
  getModels,
  removeCategorySource,
  removeChat,
  removeChatCategory,
  uploadSourcesApi,
} from '../../api/aiChatRequest';
import { AppDispatch } from '../../store';

interface SourceData {
  name: string;
  date: string;
}

interface FetchedCategories {
  name: string;
  description: string;
  chats: Chat[];
  categoryContent: {
    links: SourceData[];
    files: Array<SourceData & { size: number }>;
  };
}

interface Category {
  name: string;
  description: string;
  chats: Chat[];
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
  modelName: string;
  sources: string[];
  history: {
    author: 'chat' | 'user';
    message: string;
  }[];
}

interface AIChat {
  isLoading: boolean;
  categories: Category[];
  availableModels: string[];
  selectedChat: Chat;
}

const initialState: AIChat = {
  isLoading: false,
  categories: [],
  availableModels: [],
  selectedChat: {} as Chat,
};

export const fetchCategoriesAction = () => async (dispatch: AppDispatch) => {
  dispatch(aiChatPage.actions.setLoading(true));
  try {
    const data = await getChatCategories();
    dispatch(aiChatPage.actions.setCategories(data));
  } catch {
    console.log('error fetching categories');
  } finally {
    dispatch(aiChatPage.actions.setLoading(false));
  }
};

export const fetchAvailableModelsAction = () => async (dispatch: AppDispatch) => {
  dispatch(aiChatPage.actions.setLoading(true));
  try {
    const data = await getModels();
    dispatch(aiChatPage.actions.setModels(data));
  } catch {
    console.log('error fetching categories');
  } finally {
    dispatch(aiChatPage.actions.setLoading(false));
  }
};

export const createCategoryAction =
  (categoryName: string, categoryDescription: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await createChatCategory(categoryName, categoryDescription);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error creating category');
    }
  };

export const removeCategoryAction = (categoryName: string) => async (dispatch: AppDispatch) => {
  try {
    const data = await removeChatCategory(categoryName);
    dispatch(aiChatPage.actions.setCategories(data));
  } catch {
    console.log('error removing category');
  }
};

export const editCategoryAction =
  (oldCategoryName: string, categoryName: string, description: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const data = await editChatCategory(oldCategoryName, categoryName, description);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error editing category');
    }
  };

export const removeCategorySourceAction =
  (fileName: string, categoryName: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await removeCategorySource(fileName, categoryName);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error removing category source');
    }
  };

export const addChatAction =
  (categoryName: string, modelName: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await addChat(categoryName, modelName);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error adding chat');
    }
  };

export const removeChatAction =
  (categoryName: string, chatId: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await removeChat(categoryName, chatId);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error removing chat');
    }
  };

export const editChatSourcesAction =
  (categoryName: string, chatId: string, sources: string[], modelName?: string) =>
  (dispatch: AppDispatch) => {
    dispatch(aiChatPage.actions.setChatSources({ categoryName, chatId, sources, modelName }));
  };

export const setSelectedChatAction = (chat: Chat) => (dispatch: AppDispatch) => {
  dispatch(aiChatPage.actions.setSelectedChat(chat));
};

export const editChatAction =
  (payloadData: {
    categoryName: string;
    chatId: string;
    sources?: string[];
    chatName?: string;
    modelName: string;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      const data = await editChat(payloadData);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error editing chat');
    }
  };

export const askChatAction =
  (chatId: string, prompt: string, categoryName: string, useChain: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(aiChatPage.actions.setLoading(true));
    try {
      const data = await askChat(chatId, prompt, categoryName, useChain);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error asking chat');
    } finally {
      dispatch(aiChatPage.actions.setLoading(false));
    }
  };

export const uploadSourceAction =
  (categoryName: string, formData: FormData) => async (dispatch: AppDispatch) => {
    console.log(formData.get('link'));
    try {
      const fileToLoad = formData.get('file') as File;
      const linkToLoad =
        formData.get('link') === null ? undefined : (formData.get('link') as string);
      dispatch(
        aiChatPage.actions.addUploadingFiles({
          categoryName,
          filename: fileToLoad ? fileToLoad.name : undefined,
          link: linkToLoad,
          fileSize: fileToLoad.size,
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
    setModels(state: AIChat, action: PayloadAction<string[]>) {
      state.availableModels = action.payload;
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
    setLoading(state: AIChat, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSelectedChat(state: AIChat, action: PayloadAction<Chat>) {
      state.selectedChat = action.payload;
    },
    setChatSources(
      state: AIChat,
      action: PayloadAction<{
        categoryName: string;
        chatId: string;
        sources: string[];
        modelName?: string;
      }>
    ) {
      const selectedCategory = state.categories.find(
        (cat) => cat.name === action.payload.categoryName
      );
      const selectedChat = selectedCategory?.chats.find(
        (chat) => chat.id === action.payload.chatId
      );
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
