import React, { FC, useState } from 'react';
import styles from './chatCard.module.scss';
import { IoMdSettings, IoMdClose } from 'react-icons/io';
import { IoCheckmark } from 'react-icons/io5';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { useAppDispatch } from '../../../../store/hooks';
import { editChatAction } from '../../aiChatSlice';

interface Props {
  active: boolean;
  name: string;
  onClickHandler: () => void;
  onSettingsPress: () => void;
  onRemovePress: () => void;
  chatId: string;
  categoryName: string;
}

const ChatCard: FC<Props> = ({
  active,
  name,
  chatId,
  categoryName,
  onClickHandler,
  onSettingsPress,
  onRemovePress,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newChatName, setNewChatName] = useState(name);
  const dispatch = useAppDispatch();

  const onEditPressHandler = () => {
    setEditMode(true);
  };

  const onCloseEditPressHandler = () => {
    setNewChatName(name);
    setEditMode(false);
  };

  const onAcceptPressHandler = () => {
    dispatch(editChatAction({ chatId, categoryName, chatName: newChatName }));
    setEditMode(false);
  };

  return (
    <div onClick={onClickHandler} className={active ? styles.activeContainer : styles.container}>
      {editMode ? (
        <input
          value={newChatName}
          onChange={(e) => setNewChatName(e.currentTarget.value)}
          onBlur={() => setEditMode(false)}
        />
      ) : (
        <span>{name}</span>
      )}
      {active && (
        <div className={styles.actionsContainer}>
          {editMode ? (
            <>
              <div onClick={onAcceptPressHandler}>
                <IoCheckmark />
              </div>
              <div onClick={onCloseEditPressHandler}>
                <IoMdClose />
              </div>
            </>
          ) : (
            <>
              <div onClick={onSettingsPress}>
                <IoMdSettings />
              </div>
              <div onClick={onEditPressHandler}>
                <MdModeEdit />
              </div>
              <div onClick={onRemovePress}>
                <MdDelete />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatCard;
