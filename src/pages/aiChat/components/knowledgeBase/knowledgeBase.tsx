import React, { useState } from 'react';
import { Plus } from '../../../../assets/svg/SVGcomponent';
import styles from './knowledgeBase.module.scss';
import { Button } from '../../../../components/button';
import CategoryCard from '../categoryCard/categoryCard';
import { Modal } from '../../../../components/modal';
import CategoryForm from '../categoryForm/categoryForm';
import { useAppSelector } from '../../../../store/hooks';
import PromptTemplateCard from '../promptTemplateCard/promptTemplateCard';

const KnowledgeBase = () => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [categoryModalAction, setCategoryModalAction] = useState<
    | 'create'
    | 'edit'
    | 'remove'
    | 'removeSource'
    | 'addSource'
    | 'chatSettings'
    | 'editPrompt'
    | 'createPrompt'
  >('addSource');

  const { categories, promptTemplates } = useAppSelector((state) => state.aiChatState);

  const onAddCategoryPressHandler = () => {
    setCategoryModalAction('create');
    setShowAddCategoryModal(true);
  };

  const onAddPromptPressHandler = () => {
    setCategoryModalAction('createPrompt');
    setShowAddCategoryModal(true);
  };

  const onPromptPressHandler = () => {
    setCategoryModalAction('editPrompt');
    setShowAddCategoryModal(true);
  };

  return (
    <div className={styles.wrapper}>
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
      <div style={{ width: '100%', rowGap: 18, display: 'flex', flexDirection: 'column' }}>
        <div className={styles.titleContainer}>
          <span className={styles.categoryTitle}>Categories</span>
          <Button
            variant={'contained'}
            text={'Add category'}
            IconLeft={Plus}
            onClick={onAddCategoryPressHandler}
          />
        </div>
        <span>
          Add files and links sorted by categories to your knowledge base for AI to learn from. All
          All data analysis happens on your server, so nobody will gain access to your information.
        </span>
      </div>
      <div className={styles.categoriesListContainer}>
        {categories.map((category) => {
          return (
            <CategoryCard
              key={category.name}
              title={category.name}
              description={category.description}
              sources={
                category.categoryContent.files.length + category.categoryContent.links.length
              }
            />
          );
        })}
      </div>
      <div style={{ width: '100%', rowGap: 18, display: 'flex', flexDirection: 'column' }}>
        <div className={styles.titleContainer}>
          <span className={styles.categoryTitle}>Prompts</span>
          <Button
            variant={'contained'}
            text={'Add prompt'}
            IconLeft={Plus}
            onClick={onAddPromptPressHandler}
          />
        </div>
        <span>Add prompts to define AI answers.</span>
      </div>
      <div className={styles.promptsListContainer}>
        {promptTemplates?.map((prompt) => {
          return (
            <div key={prompt.title} style={{ width: '100%' }}>
              <PromptTemplateCard
                title={prompt.title}
                description={prompt.content}
                callback={onPromptPressHandler}
              />
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KnowledgeBase;
