import React from 'react';
import { Button } from '../../../../components/button/button';
import { Modal } from '../../../../components/modal';
import { Close } from '../../../../assets/svg/SVGcomponent';
import styles from './editInventoryModal.module.scss';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const EditInventoryModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <div className={styles.header}>
        <h3 className={styles.title}>Edit item</h3>
        <Close onClick={handleClose} />
      </div>

      <div className={styles.content}></div>

      <Button text="Add" />
    </Modal>
  );
};
