import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './conversationalWindow.module.scss';
import { IoIosAttach, IoMdSettings } from 'react-icons/io';
import { Button } from '../../../../components/button';
import { askChatAction, editChatAction } from '../../aiChatSlice';
import CategoryForm from '../categoryForm/categoryForm';
import { Modal } from '../../../../components/modal';
import { BiCopy, BiMicrophone } from 'react-icons/bi';
import { ClipLoader } from 'react-spinners';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ConversetionalWindow = () => {
  const commands = [
    {
      command: 'hey taqi * (please)',
      callback: (question: string) => {
        console.log(question);
        setPrompt(question);
        onAskPressHandler();
        resetTranscript();
      },
    },
  ];
  const { transcript, listening, resetTranscript } = useSpeechRecognition({ commands });
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  const stopListening = () => SpeechRecognition.stopListening();

  const speech = window.speechSynthesis;

  const { selectedChat, chats, isLoading, categories, messageToSpeak, promptTemplates } =
    useAppSelector((state) => state.aiChatState);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<
    'create' | 'edit' | 'remove' | 'removeSource' | 'addSource' | 'chatSettings'
  >('addSource');
  const [prompt, setPrompt] = useState('');
  const dispatch = useAppDispatch();
  const currentChat = chats.find((chat) => chat.id === selectedChat.id);

  const onAskPressHandler = () => {
    dispatch(askChatAction(selectedChat.id, prompt, selectedCategory, selectedPromptTemplate));
    setPrompt('');
    resetTranscript();
  };

  const onCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    dispatch(editChatAction({ categoryName, chatId: selectedChat.id }));
  };

  const onPromptTemplateSelect = (promptTemplateTitle: string) => {
    setSelectedPromptTemplate(promptTemplateTitle);
  };

  useEffect(() => {
    if (messageToSpeak) {
      speech.cancel();
      const speak = new SpeechSynthesisUtterance(messageToSpeak);
      speech.speak(speak);
    }
    return () => {
      speech.cancel();
    };
  }, [messageToSpeak]);

  useEffect(() => {
    setPrompt(transcript);
  }, [transcript]);

  const replaceFilenamesWithLinks = (message: string, filenames: string[]) => {
    let newMessage = structuredClone(message);
    if (filenames) {
      for (let i = 0; i < filenames.length; i++) {
        newMessage = newMessage.replace(
          filenames[i],
          `<a href=${process.env.REACT_APP_CHAT_API}download?categoryName=${currentChat?.categoryName}&rcFileName=${filenames[i]}>${filenames[i]}</a>`
        );
      }
      return newMessage;
    }
    return newMessage;
  };

  return (
    <div className={styles.container}>
      <Modal
        className={styles.modal}
        isOpen={showAddCategoryModal}
        handleClose={() => setShowAddCategoryModal(false)}
      >
        <CategoryForm
          actionType={modalAction}
          closeHandler={() => setShowAddCategoryModal(false)}
        />
      </Modal>
      <div className={styles.chatMessageWrapper}>
        {currentChat?.history.map((message, i) => {
          return (
            <>
              <div
                className={message.author === 'chat' ? styles.chatMessage : styles.userMessage}
                key={i}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: replaceFilenamesWithLinks(
                      message.message,
                      message.mentionedRCFiles ?? []
                    ),
                  }}
                />
                {message.author === 'chat' && (
                  <div onClick={() => navigator.clipboard.writeText(message.message)}>
                    <BiCopy />
                  </div>
                )}
              </div>
            </>
          );
        })}
      </div>
      <div className={styles.inputWrapper}>
        {isLoading && (
          <div>
            <ClipLoader size={28} color={'rgba(254, 97, 0, 1)'} />
          </div>
        )}
        <div className={styles.chatInputBlock}>
          <div
            onClick={() => {
              setModalAction('addSource');
              setShowAddCategoryModal(true);
            }}
          >
            <IoIosAttach />
          </div>
          <div className={styles.useContextTag}>
            <select
              onChange={(e) => {
                onCategorySelect(e.currentTarget.value);
              }}
            >
              <option value={undefined}>@Default</option>
              {categories.map((category) => {
                return (
                  <option key={category.name} value={category.name}>{`@${category.name}`}</option>
                );
              })}
            </select>
          </div>
          <div className={styles.useContextTag}>
            <select
              onChange={(e) => {
                onPromptTemplateSelect(e.currentTarget.value);
              }}
            >
              <option value={undefined}>#</option>
              {promptTemplates.map((template) => {
                return (
                  <option
                    key={template.title}
                    value={template.title}
                  >{`#${template.title}`}</option>
                );
              })}
            </select>
          </div>
          <textarea
            placeholder={'Ask your question'}
            className={styles.textarea}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.currentTarget.value);
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
        </div>
        <div className={styles.chatButtonsBlock}>
          <div
            onClick={() => {
              if (listening) {
                stopListening();
              } else {
                startListening();
              }
            }}
          >
            <BiMicrophone style={{ color: listening ? 'red' : 'black' }} />
          </div>
          <Button
            disabled={!prompt}
            className={styles.addChatButton}
            variant={'contained'}
            text={'Chat'}
            onClick={onAskPressHandler}
          />
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => {
              setModalAction('chatSettings');
              setShowAddCategoryModal(true);
            }}
          >
            <IoMdSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversetionalWindow;
