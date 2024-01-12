import React, { FC, useState } from 'react';
import { Chat, editChatAction, editChatSourcesAction } from '../../aiChatSlice';
import styles from './chatListSettingsSidebar.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { Checkbox } from '../../../../components/checkbox';
import { Button } from '../../../../components/button';

interface Props {
  chat: Chat;
  onClose: () => void;
}

const ChatsListSettingsSidebar: FC<Props> = ({ chat, onClose }) => {
  const { categories, availableModels } = useAppSelector((state) => state.aiChatState);
  const currentChatCategory = categories.find((cat) => cat.name === chat?.categoryName);
  const dispatch = useAppDispatch();
  const [selectedModel, setSelectedModel] = useState(chat?.modelName);
  const [selectedCategory, setSelectedCategory] = useState(
    chat?.categoryName ? chat?.categoryName : '@Default'
  );

  const onSourceClick = (source: string) => {
    if (chat && chat.sources.includes(source)) {
      const newSources = chat?.sources.filter((src) => src !== source);
      dispatch(editChatSourcesAction(chat?.categoryName, chat?.id, newSources));
    } else {
      if (chat) {
        dispatch(
          editChatSourcesAction(
            chat?.categoryName,
            chat?.id,
            [source, ...chat.sources],
            selectedModel
          )
        );
      }
    }
  };

  const onApplyPress = () => {
    dispatch(
      editChatAction({
        categoryName: selectedCategory,
        chatId: chat?.id,
        chatName: chat?.name,
        sources: chat?.sources,
        modelName: selectedModel ? selectedModel : chat?.modelName,
      })
    );
    onClose();
  };

  return (
    <>
      <div className={styles.container}>
        <select
          defaultValue={chat?.modelName}
          onChange={(e) => {
            setSelectedModel(e.currentTarget.value);
          }}
        >
          {availableModels.map((model) => {
            return (
              <option key={model} value={model}>
                {model}
              </option>
            );
          })}
        </select>
      </div>
      <div className={styles.plainText}>Currently used category</div>
      <div className={styles.container}>
        <select
          defaultValue={chat?.categoryName}
          onChange={(e) => {
            setSelectedCategory(e.currentTarget.value);
          }}
        >
          <option value={'@Default'}>@Default</option>
          {categories.map((cat) => {
            return (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            );
          })}
        </select>
      </div>
      <span className={styles.subtitle}>{`Used sources (${chat?.sources.length ?? '0'})`}</span>
      {currentChatCategory?.categoryContent.files.map((file, i) => {
        return (
          <div key={i} className={styles.sourceContainer} onClick={() => onSourceClick(file.name)}>
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
          <div key={i} className={styles.sourceContainer} onClick={() => onSourceClick(link.name)}>
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
      <div className={styles.buttonsContainer}>
        <Button variant={'text'} text={'Cancel'} onClick={onClose} />
        <Button variant={'contained'} text={'Done'} onClick={onApplyPress} />
      </div>
    </>
  );
};

export default ChatsListSettingsSidebar;
