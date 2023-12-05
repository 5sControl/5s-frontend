import React, { useEffect, useState } from 'react';
import styles from './categoryPage.module.scss';
import { HeaderMain } from '../../../../components/header';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import ProcessingSourceCard from '../processingFileCard/processingSourceCard';
import { Delete, Edit, Plus } from '../../../../assets/svg/SVGcomponent';
import { Button } from '../../../../components/button';
import { Modal } from '../../../../components/modal';
import CategoryForm from '../categoryForm/categoryForm';
import { fetchAvailableModelsAction, fetchCategoriesAction } from '../../aiChatSlice';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { categories } = useAppSelector((state) => state.aiChatState);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [categoryModalAction, setCategoryModalAction] = useState<
    'create' | 'edit' | 'remove' | 'removeSource' | 'addSource'
  >('addSource');
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesAction());
    dispatch(fetchAvailableModelsAction());
  }, []);

  const currentCategory = categories.find((cat) => cat.name === category);

  const onActionPressHandler = (
    actionType: 'create' | 'edit' | 'remove' | 'removeSource' | 'addSource'
  ) => {
    setCategoryModalAction(actionType);
    setShowAddCategoryModal(true);
  };

  return (
    <div className={styles.wrapper}>
      <HeaderMain title={'AI Chat'}>
        <section className={styles.tabs}>
          <div
            className={`${styles.tab} ${styles.noActive}`}
            onClick={() => navigate('/ai-chat?tab=chat')}
          >
            <span>Chat</span>
          </div>
          <div
            className={`${styles.tab} ${styles.active}`}
            onClick={() => navigate('/ai-chat?tab=base')}
          >
            <span>Knowledge base</span>
          </div>
        </section>
      </HeaderMain>
      <Modal
        className={styles.modal}
        isOpen={showAddCategoryModal}
        handleClose={() => setShowAddCategoryModal(false)}
      >
        <CategoryForm
          actionType={categoryModalAction}
          closeHandler={() => setShowAddCategoryModal(false)}
        />
      </Modal>
      <span className={styles.plainText}>{`AI Chat / @${category}`}</span>
      <div className={styles.categoryHeader}>
        <span className={styles.categoryTitle}>{`@${currentCategory?.name}`}</span>
        <div className={styles.actionsBlock}>
          <div onClick={() => onActionPressHandler('remove')}>
            <Delete />
          </div>
          <div onClick={() => onActionPressHandler('edit')}>
            <Edit />
          </div>
          <Button
            variant={'contained'}
            text={'Add to knowledge base'}
            IconLeft={Plus}
            onClick={() => onActionPressHandler('addSource')}
          />
        </div>
      </div>
      <span style={{ marginTop: '10px' }} className={styles.plainText}>
        {currentCategory?.description}
      </span>
      {(!!currentCategory?.processingSources.links.length ||
        !!currentCategory?.processingSources.files.length) && (
        <span style={{ marginTop: '20px' }} className={styles.title}>
          Learning...
        </span>
      )}
      {currentCategory?.processingSources.links.map((link) => {
        return (
          <>
            <ProcessingSourceCard
              variant={'processing'}
              key={link.name}
              name={link.name}
              size={'999mb'}
              date={link.date}
              type={'link'}
            />
            <hr />
          </>
        );
      })}
      {currentCategory?.processingSources.files.map((file) => {
        return (
          <>
            <ProcessingSourceCard
              variant={'processing'}
              key={file.name}
              name={file.name}
              size={'999mb'}
              date={file.date}
              type={'file'}
            />
            <hr />
          </>
        );
      })}
      <span style={{ marginTop: '20px' }} className={styles.title}>
        {currentCategory &&
          `In use: ${
            currentCategory?.categoryContent.links.length +
            currentCategory?.categoryContent.files.length
          } sources`}
      </span>
      {currentCategory?.categoryContent.links.map((link) => {
        return (
          <>
            <ProcessingSourceCard
              variant={'uploaded'}
              key={link.name}
              name={link.name}
              size={'999mb'}
              date={link.date}
              type={'link'}
            />
            <hr />
          </>
        );
      })}
      {currentCategory?.categoryContent.files.map((file) => {
        return (
          <>
            <ProcessingSourceCard
              variant={'uploaded'}
              key={file.name}
              name={file.name}
              size={'999mb'}
              date={file.date}
              type={'file'}
            />
            <hr />
          </>
        );
      })}
    </div>
  );
};

export default CategoryPage;
