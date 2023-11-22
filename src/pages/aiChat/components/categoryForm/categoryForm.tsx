import React, { FC, useState } from 'react';
import styles from './categoryForm.module.scss';
import { Button } from '../../../../components/button';

interface Props {
  actionType: 'create' | 'edit' | 'remove' | 'removeSource' | 'addSource';
  action: () => void;
  closeHandler: () => void;
}

const CategoryForm: FC<Props> = ({ actionType, action, closeHandler }) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryDescription, setCategoryDescription] = useState<string>('');

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
          variant={'contained'}
          text={actionType.includes('remove') ? 'Remove' : 'Done'}
          onClick={action}
        />
      </div>
    </div>
  );
};

export default CategoryForm;
