import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './conversationalWindow.module.scss';
import { IoIosAttach } from 'react-icons/io';
import { Button } from '../../../../components/button';
import { askChatAction } from '../../aiChatSlice';

const ConversetionalWindow = () => {
  const { selectedChat } = useAppSelector((state) => state.aiChatState);
  const [prompt, setPrompt] = useState('');
  const dispatch = useAppDispatch();

  const onAskPressHandler = () => {
    dispatch(askChatAction(selectedChat.id, prompt, selectedChat.categoryName));
    setPrompt('');
  };

  return (
    <div className={styles.container}>
      {selectedChat.history.map((message, i) => {
        return <span key={i}>{message.message}</span>;
      })}
      <div className={styles.inputWrapper}>
        <IoIosAttach />
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
