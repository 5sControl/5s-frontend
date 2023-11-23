import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createChatCategory, getChatCategories } from '../../api/aiChatRequest';
import { AppDispatch } from '../../store';

interface Category {
  name: string;
  description: string;
  chatsIds: string[];
  categoryContent: {
    links: string[];
    files: string[];
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

export const apiCreateChatCategory =
  (categoryName: string, categoryDescription: string) => async (dispatch: AppDispatch) => {
    try {
      const data = await createChatCategory(categoryName, categoryDescription);
      dispatch(aiChatPage.actions.setCategories(data));
    } catch {
      console.log('error creating category');
    }
  };

const aiChatPage = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setCategories(state: AIChat, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
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
