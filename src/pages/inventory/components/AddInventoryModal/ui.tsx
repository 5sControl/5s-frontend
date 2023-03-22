import React from 'react';
import { Button } from '../../../../components/button/button';
import { Modal } from '../../../../components/modal';
import styles from './addInventoryModal.module.scss';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const AddInventoryModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <div className={styles.header}></div>

      <div className={styles.content}></div>

      <Button text="Add" />
    </Modal>
  );
};
