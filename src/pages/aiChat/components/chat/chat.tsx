import React from 'react';
import ChatsList from '../chatsList/chatsList';
import ConversetionalWindow from '../conversationlaWindow/conversetionalWindow';
import { useAppSelector } from '../../../../store/hooks';

const Chat = () => {
  const { selectedChat } = useAppSelector((state) => state.aiChatState);
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        columnGap: '10px',
        justifyContent: 'flex-start',
      }}
    >
      <ChatsList />
      <ConversetionalWindow />
    </div>
  );
};

export default Chat;
