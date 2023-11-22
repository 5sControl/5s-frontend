import React, { useState } from 'react';
import styles from './aiChat.module.scss';
import { HeaderMain } from '../../components/header';
import Chat from './components/chat/chat';
import KnowledgeBase from './components/knowledgeBase/knowledgeBase';

const AiChatPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'base'>('chat');

  return (
    <>
      <div className={styles.aiChat}>
        <HeaderMain title={'AI Chat'}>
          <section className={styles.tabs}>
            <div
              className={`${styles.tab} ${activeTab === 'chat' ? styles.active : styles.noActive}`}
              onClick={() => setActiveTab('chat')}
            >
              <span>Chat</span>
            </div>
            <div
              className={`${styles.tab} ${activeTab === 'base' ? styles.active : styles.noActive}`}
              onClick={() => setActiveTab('base')}
            >
              <span>Knowledge base</span>
            </div>
          </section>
        </HeaderMain>
        {activeTab === 'chat' ? <Chat /> : <KnowledgeBase />}
        <main className={styles.wrapper}>
          <section className={styles.content}></section>
        </main>
      </div>
    </>
  );
};

export default AiChatPage;
