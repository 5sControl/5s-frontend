import React from 'react';
import styles from './chatsList.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import ChatCard from '../chatCard/chatCard';
import { Button } from '../../../../components/button';
import { Plus } from '../../../../assets/svg/SVGcomponent';
import { addChatAction, removeChatAction, setSelectedChatAction } from '../../aiChatSlice';

const ChatsList = () => {
  const { selectedChat, availableModels, chats } = useAppSelector((state) => state.aiChatState);

  const dispatch = useAppDispatch();

  const onCreateChatHandler = async () => {
    await dispatch(addChatAction(availableModels[0]));
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatsWrapper}>
        <div>
          {chats.map((chat, i) => {
            return (
              <ChatCard
                name={chat.name}
                active={selectedChat ? chat.id === selectedChat.id : false}
                onClickHandler={() => dispatch(setSelectedChatAction(chat))}
                key={i}
                onRemovePress={() => dispatch(removeChatAction(chat.categoryName, chat.id))}
                chatId={chat.id}
                modelName={chat.modelName}
                categoryName={chat.categoryName}
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
        onClick={onCreateChatHandler}
      />
    </div>
  );
};

export default ChatsList;
