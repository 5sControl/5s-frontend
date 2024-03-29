import React, { FC, useState } from 'react';
import styles from './processingSourcesCard.module.scss';
import {
  CloseCross,
  Delete,
  Download,
  FileIcon,
  LinkIcon,
} from '../../../../assets/svg/SVGcomponent';
import { ClipLoader } from 'react-spinners';
import CategoryForm from '../categoryForm/categoryForm';
import { Modal } from '../../../../components/modal';
import { BiCopy } from 'react-icons/bi';
import { downloadFileApi } from '../../../../api/aiChatRequest';
import { useParams } from 'react-router-dom';

interface Props {
  name: string;
  size: string;
  date: string;
  type: 'link' | 'file';
  variant: 'processing' | 'uploaded';
}

const ProcessingSourceCard: FC<Props> = ({ name, size, date, type, variant }) => {
  const { category } = useParams();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [categoryModalAction, setCategoryModalAction] = useState<
    'create' | 'edit' | 'remove' | 'removeSource' | 'addSource'
  >('addSource');

  const onRemoveCategoryPress = () => {
    setCategoryModalAction('removeSource');
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
          fileName={name}
          actionType={categoryModalAction}
          closeHandler={() => setShowAddCategoryModal(false)}
        />
      </Modal>
      <div className={styles.dataContainer}>
        <div className={styles.fileImage}>
          {type === 'file' ? <FileIcon /> : <LinkIcon />}
          <span className={styles.plainText}>{name}</span>
        </div>
        <span className={styles.plainText}>{size}</span>
        <span className={styles.plainText}>{date}</span>
        <div className={styles.actionsBlock}>
          {variant === 'processing' && (
            <>
              <ClipLoader size={24} color={'rgba(254, 97, 0, 1)'} />
              <CloseCross />
            </>
          )}
          {variant === 'uploaded' && (
            <>
              {type === 'file' ? (
                <a
                  href={`${process.env.REACT_APP_CHAT_API}download?categoryName=${category}&fileName=${name}`}
                >
                  <Download />
                </a>
              ) : (
                <BiCopy />
              )}
              <div onClick={onRemoveCategoryPress}>
                <Delete />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingSourceCard;
