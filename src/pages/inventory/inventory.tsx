import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../components/button/button';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { AddInventoryModal } from './components/AddInventoryModal';
import { InventoryReport } from './components/InventoryReport';
import { getInventoryItemsAsync } from './inventorySlice';
import styles from './inventory.module.scss';
import { selectEditInventoryModal } from './components/EditInventoryModal/editInventoryModalSlice';

export const Inventory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { connectResponse } = useAppSelector(selectEditInventoryModal);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    dispatch(getInventoryItemsAsync({ token: cookies.token, hostname: window.location.hostname }));
  }, [connectResponse]);

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

            {/* <Button text="Add item" isIcon onClick={addInventoryButton} /> */}
          </div>

          <InventoryReport />
        </div>
      </WrapperPage>
    </>
  );
};
