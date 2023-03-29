import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../components/button/button';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { AddInventoryModal } from './components/AddInventoryModal';
import { InventoryReport } from './components/InventoryReport';
import {
  getCamerasAsync,
  getInventoryItemHistoryAsync,
  getInventoryItemsAsync,
  selectInventory,
} from './inventorySlice';
import styles from './inventory.module.scss';
import { selectEditInventoryModal } from './components/EditInventoryModal/editInventoryModalSlice';
import { InventoryItemsList } from './components/InventoryItemsList';
import { Cover } from '../../components/cover';
import { Preloader } from '../../components/preloader';
import { InventoryCard } from './components/InventoryCard';
import { selectActiveInventoryItem } from './components/InventoryItemsList/InventoryItemsListSlice';
import moment from 'moment-timezone';
import { selectAddInventoryModal } from './components/AddInventoryModal/addInventoryModalSlice';
import { selectDeleteInventoryModal } from './components/DeleteInventoryModal/deleteInventoryModalSlice';

export const Inventory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { connectResponse } = useAppSelector(selectEditInventoryModal);
  const { connectDeleteResponse } = useAppSelector(selectDeleteInventoryModal);
  const { connectResponseDataAdd } = useAppSelector(selectAddInventoryModal);
  const { inventoryItems, isLoading } = useAppSelector(selectInventory);
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    dispatch(getInventoryItemsAsync({ token: cookies.token, hostname: window.location.hostname }));
  }, [connectResponse, connectResponseDataAdd, connectDeleteResponse]);

  useEffect(() => {
    dispatch(getCamerasAsync({ token: cookies.token, hostname: window.location.hostname }));
  }, []);

  useEffect(() => {
    if (activeInventoryItem) {
      dispatch(
        getInventoryItemHistoryAsync({
          token: cookies.token,
          hostname: window.location.hostname,
          params: { camera: activeInventoryItem.camera, date: moment().format('YYYY-MM-DD') },
        })
      );
    }
  }, [activeInventoryItem]);

  const addInventoryButton = () => {
    setIsOpen(true);
  };

  const closeInventoryButton = () => {
    setIsOpen(false);
  };

  return (
    <>
      <AddInventoryModal isOpen={isOpen} handleClose={closeInventoryButton} />
      <WrapperPage>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Inventory</h2>

            <Button text="Add item" isIcon onClick={addInventoryButton} />
          </div>

          {!isLoading && inventoryItems ? (
            <>
              <InventoryReport />
              <div className={styles.body}>
                <InventoryItemsList data={inventoryItems} />

                {activeInventoryItem ? (
                  <InventoryCard data={activeInventoryItem} />
                ) : (
                  <Cover className={styles.noInventoryItem}>
                    <h4 className={styles.title}>No order</h4>
                    <p className={styles.subtitle}>Select an order from the list on the left</p>
                  </Cover>
                )}
              </div>
            </>
          ) : (
            <Preloader loading={isLoading} />
          )}
        </div>
      </WrapperPage>
    </>
  );
};
