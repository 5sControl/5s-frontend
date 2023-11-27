import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './conversationalWindow.module.scss';
import { IoIosAttach } from 'react-icons/io';
import { Button } from '../../../../components/button';
import { askChatAction } from '../../aiChatSlice';
import CategoryForm from '../categoryForm/categoryForm';
import { Modal } from '../../../../components/modal';
import { BiCopy } from 'react-icons/bi';
import { ClipLoader } from 'react-spinners';

const ConversetionalWindow = () => {
  const { selectedChat, categories, isLoading } = useAppSelector((state) => state.aiChatState);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [prompt, setPrompt] = useState('');
  const dispatch = useAppDispatch();

  const currentChat = categories
    .find((cat) => cat.name === selectedChat.categoryName)
    ?.chats.find((chat) => chat.id === selectedChat.id);

  const onAskPressHandler = () => {
    dispatch(askChatAction(selectedChat.id, prompt, selectedChat.categoryName));
    setPrompt('');
  };

  return (
    <div className={styles.container}>
      <Modal
        className={styles.modal}
        isOpen={showAddCategoryModal}
        handleClose={() => setShowAddCategoryModal(false)}
      >
        <CategoryForm
          actionType={'addSource'}
          closeHandler={() => setShowAddCategoryModal(false)}
        />
      </Modal>
      {currentChat?.history.map((message, i) => {
        return (
          <>
            <div
              className={message.author === 'chat' ? styles.chatMessage : styles.userMessage}
              key={i}
            >
              {message.message}
              {message.author === 'chat' && (
                <div onClick={() => navigator.clipboard.writeText(message.message)}>
                  <BiCopy />
                </div>
              )}
            </div>
          </>
        );
      })}
      <div className={styles.inputWrapper}>
        {isLoading && (
          <div>
            <ClipLoader size={28} color={'rgba(254, 97, 0, 1)'} />
          </div>
        )}
        <div onClick={() => setShowAddCategoryModal(true)}>
          <IoIosAttach />
        </div>
        <input
          className={styles.input}
          value={prompt}
          onChange={(e) => setPrompt(e.currentTarget.value)}
        />
        <Button
          disabled={!prompt}
          className={styles.addChatButton}
          variant={'contained'}
          text={'Chat'}
          onClick={onAskPressHandler}
        />
      </div>
    </div>
  );
};

export default ConversetionalWindow;
