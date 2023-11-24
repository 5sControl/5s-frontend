import React, { FC, useState } from 'react';
import styles from './categoryForm.module.scss';
import { Button } from '../../../../components/button';
import { useAppDispatch } from '../../../../store/hooks';
import { apiCreateCategory, removeCategory, removeCategorySourceAction } from '../../aiChatSlice';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  fileName?: string;
  actionType: 'create' | 'edit' | 'remove' | 'removeSource' | 'addSource';
  closeHandler: () => void;
}

const CategoryForm: FC<Props> = ({ actionType, closeHandler, fileName }) => {
  const { category } = useParams();
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryDescription, setCategoryDescription] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
        dispatch(apiCreateCategory(categoryName, categoryDescription));
        closeHandler();
        break;
      case 'removeSource':
        if (!category || !fileName) return;
        dispatch(removeCategorySourceAction(fileName, category));
        closeHandler();
        break;
      case 'remove':
        if (!category) return;
        dispatch(removeCategory(category));
        closeHandler();
        navigate('/ai-chat?tab=base');
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
            <select>
              <option value={'1'}>1</option>
              <option value={'2'}>2</option>
              <option value={'3'}>3</option>
              <option value={'4'}>4</option>
              <option value={'5'}>5</option>
              <option value={'6'}>6</option>
            </select>
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
