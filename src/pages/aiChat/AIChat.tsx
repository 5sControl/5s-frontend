import React, { useEffect } from 'react';
import styles from './aiChat.module.scss';
import { HeaderMain } from '../../components/header';
import Chat from './components/chat/chat';
import KnowledgeBase from './components/knowledgeBase/knowledgeBase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAvailableModelsAction, fetchCategoriesAction, fetchChatsAction } from './aiChatSlice';
import { useAppDispatch } from '../../store/hooks';

const AiChatPage = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') as 'chat' | 'base';
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesAction());
    dispatch(fetchChatsAction());
    dispatch(fetchAvailableModelsAction());
  }, []);

  return (
    <>
      <div className={styles.aiChat}>
        <HeaderMain title={'AI Chat'}>
          <section className={styles.tabs}>
            <div
              className={`${styles.tab} ${activeTab === 'chat' ? styles.active : styles.noActive}`}
              onClick={() => navigate('/ai-chat?tab=chat')}
            >
              <span>Chat</span>
            </div>
            <div
              className={`${styles.tab} ${activeTab === 'base' ? styles.active : styles.noActive}`}
              onClick={() => navigate('/ai-chat?tab=base')}
            >
              <span>Knowledge base</span>
            </div>
          </section>
        </HeaderMain>
        {activeTab === 'chat' ? <Chat /> : <KnowledgeBase />}
      </div>
    </>
  );
};

export default AiChatPage;
