import React, { FC } from 'react';
import { Chat, editChatAction, editChatSourcesAction } from '../../aiChatSlice';
import styles from './chatListSettingsSidebar.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { Checkbox } from '../../../../components/checkbox';
import { Button } from '../../../../components/button';

interface Props {
  isOpened: boolean;
  chat?: Chat;
}

const ChatsListSettingsSidebar: FC<Props> = ({ chat, isOpened }) => {
  const { categories } = useAppSelector((state) => state.aiChatState);
  const currentChatCategory = categories.find((cat) => cat.name === chat?.categoryName);
  const dispatch = useAppDispatch();

  const onSourceClick = (source: string) => {
    if (chat && chat.sources.includes(source)) {
      const newSources = chat?.sources.filter((src) => src !== source);
      dispatch(editChatSourcesAction(chat?.categoryName, chat?.id, newSources));
    } else {
      if (chat) {
        dispatch(editChatSourcesAction(chat?.categoryName, chat?.id, [source, ...chat.sources]));
      }
    }
  };

  const onApplyPress = () => {
    if (currentChatCategory && chat) {
      console.log('here');
      dispatch(
        editChatAction({
          categoryName: currentChatCategory.name,
          chatId: chat.id,
          chatName: chat.name,
          sources: chat.sources,
        })
      );
    }
  };

  return (
    <>
      {isOpened && chat && (
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <span className={styles.title}>Chat settings</span>
            <div className={styles.plainText}>{`Used @${
              chat.categoryName ? chat.categoryName : ''
            }`}</div>
            <span className={styles.subtitle}>{`Used sources (${chat.sources.length})`}</span>
            {currentChatCategory?.categoryContent.files.map((file, i) => {
              return (
                <div
                  key={i}
                  className={styles.sourceContainer}
                  onClick={() => onSourceClick(file.name)}
                >
                  <Checkbox
                    id={''}
                    name={''}
                    label={''}
                    value={''}
                    isChecked={chat?.sources.includes(file.name)}
                  />
                  <span className={styles.plainText}>{file.name}</span>
                </div>
              );
            })}
            {currentChatCategory?.categoryContent.links.map((link, i) => {
              return (
                <div
                  key={i}
                  className={styles.sourceContainer}
                  onClick={() => onSourceClick(link.name)}
                >
                  <Checkbox
                    id={''}
                    name={''}
                    label={''}
                    value={''}
                    isChecked={chat?.sources.includes(link.name)}
                  />
                  <span className={styles.plainText}>{link.name}</span>
                </div>
              );
            })}
          </div>
          <Button
            className={styles.applyButton}
            variant={'outlined'}
            text={'Apply'}
            onClick={onApplyPress}
          />
        </div>
      )}
    </>
  );
};

export default ChatsListSettingsSidebar;
