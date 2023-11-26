import React, { useState } from 'react';
import styles from './chatsList.module.scss';
import { useAppSelector } from '../../../../store/hooks';
import ChatCard from '../chatCard/chatCard';
import { Button } from '../../../../components/button';
import { Plus } from '../../../../assets/svg/SVGcomponent';

const ChatsList = () => {
  const { categories } = useAppSelector((state) => state.aiChatState);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] ? categories[0].name : '');
  const [selectedChat, setSelectedChat] = useState(
    categories.find((cat) => cat.name === selectedCategory)?.chats[0]
  );

  return (
    <div className={styles.container}>
      <div className={styles.chatsWrapper}>
        <select
          defaultValue={categories[0]?.name}
          onChange={(e) => setSelectedCategory(e.currentTarget.value)}
        >
          {categories.map((category) => {
            return <option key={category.name}>{`@${category.name}`}</option>;
          })}
        </select>
        <div>
          {categories
            .find((cat) => cat.name === selectedCategory)
            ?.chats.map((chat) => {
              return (
                <ChatCard
                  name={chat.name}
                  active={chat.id === selectedChat?.id}
                  onClickHandler={() => setSelectedChat(chat)}
                  key={chat.name}
                />
              );
            })}
        </div>
      </div>
      <Button
        className={styles.addChatButton}
        variant={'contained'}
        text={'Add chat'}
        IconLeft={Plus}
        onClick={() => null}
      />
    </div>
  );
};

export default ChatsList;
