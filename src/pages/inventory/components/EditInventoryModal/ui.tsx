import React from 'react';
import { Button } from '../../../../components/button/button';
import { Modal } from '../../../../components/modal';
import { Close } from '../../../../assets/svg/SVGcomponent';
import styles from './editInventoryModal.module.scss';
import { Input } from '../../../../components/input';

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

      <div className={styles.content}>
        <div className={styles.input}>
          <Input
            id="1"
            name="name"
            type="text"
            label="Item name"
            onChange={() => console.log(';click')}
            placeholder="Click me!"
          />
        </div>
        <div className={styles.input}>
          <Input
            id="2"
            name="lowStockLevel"
            type="text"
            label="Low stock level"
            onChange={() => console.log(';click')}
            placeholder="Click me!"
          />
        </div>
        <div className={styles.input}>
          <Input
            id="3"
            name="camera"
            type="select"
            label="Select a camera"
            onChange={() => console.log(';click')}
            placeholder="Click me!"
          />
        </div>
        <Button text="Save" className={styles.button} />
      </div>
    </Modal>
  );
};
