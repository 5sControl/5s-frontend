import React, { useState } from 'react';
import { Plus, ChatInfo } from '../../../../assets/svg/SVGcomponent';
import styles from './knowledgeBase.module.scss';
import { Button } from '../../../../components/button';
import CategoryCard from '../categoryCard/categoryCard';
import { Modal } from '../../../../components/modal';
import CategoryForm from '../categoryForm/categoryForm';

const KnowledgeBase = () => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [categoryModalAction, setCategoryModalAction] = useState<
    'create' | 'edit' | 'remove' | 'removeSource' | 'addSource'
  >('addSource');

  return (
    <div className={styles.wrapper}>
      <Modal
        className={styles.modal}
        isOpen={showAddCategoryModal}
        handleClose={() => setShowAddCategoryModal(false)}
      >
        <CategoryForm
          actionType={categoryModalAction}
          action={() => null}
          closeHandler={() => setShowAddCategoryModal(false)}
        />
      </Modal>
      <div className={styles.infoContainer}>
        <ChatInfo />
        <span>
          Add files and links sorted by categories to your knowledge base for AI to learn from. All
          data analysis happens on your server, so nobody will gain access to your information.
        </span>
      </div>
      <div className={styles.titleContainer}>
        <span className={styles.categoryTitle}>Categories</span>
        <Button
          variant={'contained'}
          text={'Add category'}
          IconLeft={Plus}
          onClick={() => setShowAddCategoryModal(true)}
        />
      </div>
      <div className={styles.categoriesListContainer}>
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
        <CategoryCard title={'General'} description={'some category'} sources={999} />
      </div>
    </div>
  );
};

export default KnowledgeBase;
