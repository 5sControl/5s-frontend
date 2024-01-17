import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './conversationalWindow.module.scss';
import { IoIosAttach, IoMdSettings } from 'react-icons/io';
import { Button } from '../../../../components/button';
import { addChatAction, askChatAction, editChatAction } from '../../aiChatSlice';
import CategoryForm from '../categoryForm/categoryForm';
import { Modal } from '../../../../components/modal';
import { BiCopy } from 'react-icons/bi';
import { ClipLoader } from 'react-spinners';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Microphone, PlayVoice, StopVoiceRecognition } from '../../../../assets/svg/SVGcomponent';

export const playMachineAudioFragment = async (text: string) => {
  return new Promise(() => {
    const synth = window.speechSynthesis;
    if (text !== '') {
      const utterThis: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();

      utterThis.voice = voices.find((voice) => {
        return voice.lang.includes('en');
      }) as SpeechSynthesisVoice;

      utterThis.pitch = 0.9;
      utterThis.rate = 0.8;
      synth.speak(utterThis);
    }
  });
};

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
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const speech = window.speechSynthesis;

  const { selectedChat, chats, isLoading, categories, messageToSpeak, promptTemplates } =
    useAppSelector((state) => state.aiChatState);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<string>('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<
    'create' | 'edit' | 'remove' | 'removeSource' | 'addSource' | 'chatSettings'
  >('addSource');
  const [prompt, setPrompt] = useState('');
  const dispatch = useAppDispatch();
  const currentChat = chats.find((chat) => chat.id === selectedChat.id);
  const messageWindowRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLSpanElement>(null);

  const onInputEnterPress = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      }
      if (prompt) {
        onAskPressHandler();
      }
    }
  };

  const onAskPressHandler = async () => {
    if (!selectedChat.id) {
      dispatch(addChatAction());
      return;
    }
    dispatch(askChatAction(selectedChat.id, prompt, selectedCategory, selectedPromptTemplate));
    setPrompt('');
    if (textAreaRef.current) {
      textAreaRef.current.textContent = '';
    }
    resetTranscript();
  };

  const onCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    dispatch(editChatAction({ categoryName, chatId: selectedChat.id }));
  };

  const onPromptTemplateSelect = (promptTemplateTitle: string) => {
    setSelectedPromptTemplate(promptTemplateTitle);
    dispatch(editChatAction({ promptTemplateTitle, chatId: selectedChat.id }));
  };

  useEffect(() => {
    speech.getVoices();
  }, []);

  useEffect(() => {
    if (messageToSpeak && selectedChat.autoplayAnswers) {
      speech.cancel();
      playMachineAudioFragment(messageToSpeak);
    }
    return () => {
      speech.cancel();
    };
  }, [messageToSpeak]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.textContent = transcript;
    }
    setPrompt(transcript);
  }, [transcript]);

  const replaceFilenamesWithLinks = (message: string, filenames: string[]) => {
    let newMessage = structuredClone(message);
    if (filenames) {
      for (let i = 0; i < filenames.length; i++) {
        newMessage = newMessage.replaceAll(
          filenames[i],
          `<a href=${process.env.REACT_APP_CHAT_API}download?categoryName=${currentChat?.categoryName}&rcFileName=${filenames[i]}>${filenames[i]}</a>`
        );
      }
      return newMessage;
    }
    return newMessage;
  };

  const scrollToBottom = () => {
    messageWindowRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, selectedChat]);

  useEffect(() => {
    setSelectedPromptTemplate(selectedChat.promptTemplateTitle ?? '#');
    setSelectedCategory(selectedChat.categoryName);
  }, [selectedChat]);

  return (
    <div className={styles.container}>
      {!currentChat?.history.length && (
        <div className={styles.emptyChatPlaceholder}>
          <p>Start chatting with AI</p>
          <p>Select which @category knowledge to use</p>
          <p>@Default gives you access to basic knowledge</p>
        </div>
      )}
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
      <div className={styles.chatMessageWrapper} ref={messageWindowRef}>
        {currentChat?.history.map((message, i) => {
          return (
            <div
              className={message.author === 'chat' ? styles.chatMessage : styles.userMessage}
              key={i}
              ref={i === currentChat?.history.length - 1 ? messageWindowRef : null}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={styles.chatMessageTitle}>{`@${message.usedCategory ?? ''} #${
                  message.usedPrompt ?? ''
                }`}</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: replaceFilenamesWithLinks(
                      message.message,
                      message.mentionedRCFiles ?? []
                    ),
                  }}
                />
              </div>
              <div>
                <div onClick={() => navigator.clipboard.writeText(message.message)}>
                  <BiCopy />
                </div>
                <div
                  onClick={() => {
                    if (speech.speaking) {
                      speech.cancel();
                      return;
                    }
                    playMachineAudioFragment(message.message);
                  }}
                >
                  <PlayVoice />
                </div>
              </div>
            </div>
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
              value={selectedCategory}
              defaultValue={selectedChat.categoryName}
            >
              <option value={undefined}>@Default</option>
              {categories.map((category, i) => {
                return <option key={i} value={category.name}>{`@${category.name}`}</option>;
              })}
            </select>
          </div>
          <div className={styles.useContextTag}>
            <select
              value={selectedPromptTemplate}
              onChange={(e) => {
                onPromptTemplateSelect(e.currentTarget.value);
              }}
              defaultValue={selectedChat.promptTemplateTitle}
            >
              <option value={undefined}>#</option>
              {promptTemplates.map((template, i) => {
                return <option key={i} value={template.title}>{`#${template.title}`}</option>;
              })}
            </select>
          </div>
          <span
            ref={textAreaRef}
            suppressContentEditableWarning={true}
            role={'textbox'}
            onKeyDown={(e) => onInputEnterPress(e)}
            className={styles.textarea}
            contentEditable
            onInput={() => {
              resetTranscript();
              if (textAreaRef.current) {
                setPrompt(textAreaRef.current.textContent as string);
              }
            }}
          />
        </div>
        <div className={styles.chatButtonsBlock}>
          <div onClick={() => (listening ? stopListening() : startListening())}>
            {listening ? <StopVoiceRecognition /> : <Microphone />}
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
              if (selectedChat) {
                setModalAction('chatSettings');
                setShowAddCategoryModal(true);
              }
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
