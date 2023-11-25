import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createChatCategory,
  editChatCategory,
  getChatCategories,
  removeCategorySource,
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
  chatsIds: string[];
  categoryContent: {
    links: SourceData[];
    files: SourceData[];
  };
}

interface Category {
  name: string;
  description: string;
  chatsIds: string[];
  categoryContent: {
    links: SourceData[];
    files: SourceData[];
  };
  processingSources: {
    links: SourceData[];
    files: SourceData[];
  };
}

export interface Chat {
  id: string;
  name: string;
  categoryName: string;
  sources: string[];
}

interface AIChat {
  categories: Category[];
  chats: Chat[];
}

const initialState: AIChat = {
  categories: [],
  chats: [],
};

export const fetchCategories = () => async (dispatch: AppDispatch) => {
  try {
    const data = await getChatCategories();
    dispatch(aiChatPage.actions.setCategories(data));
  } catch {
    console.log('error fetching categories');
  }
};

export const apiCreateCategory =
  (categoryName: string, categoryDescription: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await createChatCategory(categoryName, categoryDescription);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error creating category');
    }
  };

export const removeCategory = (categoryName: string) => async (dispatch: AppDispatch) => {
  try {
    const data = await removeChatCategory(categoryName);
    dispatch(aiChatPage.actions.setCategories(data));
  } catch {
    console.log('error fetching categories');
  }
};

export const editCategory =
  (oldCategoryName: string, categoryName: string, description: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const data = await editChatCategory(oldCategoryName, categoryName, description);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error fetching categories');
    }
  };

export const removeCategorySourceAction =
  (fileName: string, categoryName: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await removeCategorySource(fileName, categoryName);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error fetching categories');
    }
  };

export const uploadSourceAction =
  (categoryName: string, formData: FormData) => async (dispatch: AppDispatch) => {
    try {
      const data = await uploadSourcesApi(categoryName, formData);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error uploading categories');
    }
  };

const aiChatPage = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
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
    },
    setChats(state: AIChat, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
    addChat(state: AIChat, action: PayloadAction<Chat>) {
      state.chats.unshift(action.payload);
    },
  },
});

export const { addChat } = aiChatPage.actions;
export default aiChatPage.reducer;
