import React, { useState } from 'react';
import { Button } from '../../components/button';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { AddInventoryModal } from './components/AddInventoryModal';
import styles from './inventory.module.scss';

export const Inventory: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const addInventoryButton = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <AddInventoryModal isOpen={isOpen} handleClose={() => addInventoryButton()} />
      <WrapperPage>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Inventory</h2>

            <Button text="Add item" isIcon onClick={addInventoryButton} />
          </div>
        </div>
      </WrapperPage>
    </>
  );
};
