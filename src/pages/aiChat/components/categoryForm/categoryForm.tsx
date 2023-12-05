import React, { FC, useState } from 'react';
import styles from './categoryForm.module.scss';
import { Button } from '../../../../components/button';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  createCategoryAction,
  editCategoryAction,
  removeCategoryAction,
  removeCategorySourceAction,
  uploadSourceAction,
} from '../../aiChatSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { MdFileUpload } from 'react-icons/md';

interface Props {
  fileName?: string;
  actionType: 'create' | 'edit' | 'remove' | 'removeSource' | 'addSource';
  closeHandler: () => void;
}

const CategoryForm: FC<Props> = ({ actionType, closeHandler, fileName }) => {
  const { category } = useParams();
  const { categories } = useAppSelector((state) => state.aiChatState);
  const [categoryName, setCategoryName] = useState<string>(categories[0] ? categories[0].name : '');
  const [categoryDescription, setCategoryDescription] = useState<string>('');
  const [fileToLoad, setFileToLoad] = useState<File | null>();
  const [linkToLoad, setLinkToLoad] = useState<string>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleUploadSources = () => {
    if (!linkToLoad && !fileToLoad) {
      return;
    }
    const formData = new FormData();
    if (fileToLoad) {
      formData.append('file', fileToLoad);
    }
    if (linkToLoad) {
      formData.append('link', linkToLoad);
    }
    dispatch(uploadSourceAction(categoryName, formData));
  };

  const title =
    actionType === 'create'
      ? 'Add category'
      : actionType === 'edit'
      ? 'Edit category'
      : actionType === 'remove'
      ? 'Remove category'
      : actionType === 'addSource'
      ? 'Add to knowledge base'
      : 'Remove source';

  const onFormSubmit = () => {
    switch (actionType) {
      case 'create':
        dispatch(createCategoryAction(categoryName, categoryDescription));
        closeHandler();
        break;
      case 'removeSource':
        if (!category || !fileName) return;
        dispatch(removeCategorySourceAction(fileName, category));
        closeHandler();
        break;
      case 'remove':
        if (!category) return;
        dispatch(removeCategoryAction(category));
        closeHandler();
        navigate('/ai-chat?tab=base');
        break;
      case 'edit':
        if (!category) return;
        dispatch(editCategoryAction(category, categoryName, categoryDescription));
        navigate(`/ai-chat/base/${categoryName}`);
        closeHandler();
        break;
      case 'addSource':
        handleUploadSources();
        closeHandler();
        break;
      default:
        return;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <span className={styles.title}>{title}</span>
        {(actionType === 'create' || actionType === 'edit') && (
          <>
            <span className={styles.plainText}>Category name</span>
            <input
              value={categoryName}
              placeholder={'Enter category name, @ will be added automatically'}
              onChange={(e) => setCategoryName(e.currentTarget.value)}
            />
            <span className={styles.plainText}>Description</span>
            <input
              value={categoryDescription}
              placeholder={'Describe this category to help AI'}
              onChange={(e) => setCategoryDescription(e.currentTarget.value)}
            />
          </>
        )}
        {actionType === 'addSource' && (
          <>
            <span className={styles.plainText}>Category name</span>
            <select
              defaultValue={category}
              onChange={(e) => setCategoryName(e.currentTarget.value)}
            >
              {categories.map((category) => {
                return (
                  <option key={category.name} value={category.name}>
                    {`@${category.name}`}
                  </option>
                );
              })}
            </select>
            <div className={styles.formDataContainer}>
              <label>
                <div className={styles.uploadButton}>
                  <MdFileUpload color={'white'} />
                  Upload
                </div>
                <input
                  style={{ display: 'none', cursor: 'pointer' }}
                  type={'file'}
                  onChange={(e) => setFileToLoad(e.target.files ? e.target.files[0] : null)}
                />
              </label>
              <span className={styles.plainText}>and/or</span>
              <input
                value={linkToLoad}
                placeholder={'InsertUrl'}
                onChange={(e) => setLinkToLoad(e.currentTarget.value)}
              />
            </div>
            <div>{fileToLoad?.name}</div>
          </>
        )}
      </div>
      {actionType === 'remove' && (
        <span className={styles.plainText}>
          You will loose access to all its sources. Previous chats with it will be deleted.
        </span>
      )}
      {actionType === 'removeSource' && (
        <span className={styles.plainText}>
          AI will loose access to this source and won’t be able to use it in its answers.
        </span>
      )}
      <div className={styles.buttonsContainer}>
        <Button variant={'text'} text={'Cancel'} onClick={closeHandler} />
        <Button
          disabled={
            (!categoryName || !categoryDescription) &&
            (actionType === 'create' || actionType === 'edit')
          }
          variant={'contained'}
          text={actionType.includes('remove') ? 'Remove' : 'Done'}
          onClick={onFormSubmit}
        />
      </div>
    </div>
  );
};

export default CategoryForm;
