import React, { FC } from 'react';
import styles from './chatCard.module.scss';
import { IoMdSettings } from 'react-icons/io';
import { MdModeEdit, MdDelete } from 'react-icons/md';

interface Props {
  active: boolean;
  name: string;
  onClickHandler: () => void;
}

const ChatCard: FC<Props> = ({ active, name, onClickHandler }) => {
  return (
    <div onClick={onClickHandler} className={active ? styles.activeContainer : styles.container}>
      <span>{name}</span>
      {active && (
        <div className={styles.actionsContainer}>
          <IoMdSettings />
          <MdModeEdit />
          <MdDelete />
        </div>
      )}
    </div>
  );
};

export default ChatCard;
