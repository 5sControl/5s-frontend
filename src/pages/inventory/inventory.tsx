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
  getIsFullOwnCompanyInfo,
  getSMTPConnect,
  selectInventory,
} from './inventorySlice';
import styles from './inventory.module.scss';
import { selectActiveInventoryItem } from './components/InventoryItemsList/InventoryItemsListSlice';
import moment from 'moment';
import { selectInventoryHistory } from './components/InventoryHistory/inventoryHistorySlice';
import { Plus } from '../../assets/svg/SVGcomponent';
import {
  setIsOpenNightModal,
  selectNightInventoryModal,
} from './components/NightModeModal/NightModeSlice';

import { IoMdSettings } from 'react-icons/io';
import { NightModeModal } from './components/NightModeModal';
import { Notification } from '../../components/notification/notification';
import { HeaderMain } from '../../components/header';

export const Inventory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { camerasData } = useAppSelector(selectInventory);
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);
  const { selectDate } = useAppSelector(selectInventoryHistory);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cookies] = useCookies(['token']);
  const [isNotification, setIsNotification] = useState<boolean>(false);

  const { isOpenNightModal } = useAppSelector(selectNightInventoryModal);

  useEffect(() => {
    dispatch(getCamerasAsync({ token: cookies.token, hostname: window.location.hostname }));
    dispatch(getSMTPConnect({ token: cookies.token, hostname: window.location.hostname }));
    dispatch(getIsFullOwnCompanyInfo({ token: cookies.token, hostname: window.location.hostname }));
  }, []);

  useEffect(() => {
    if (activeInventoryItem) {
      dispatch(
        getInventoryItemHistoryAsync({
          token: cookies.token,
          hostname: window.location.hostname,
          params: {
            itemId: activeInventoryItem.id,
            date: selectDate ? selectDate : moment().format('YYYY-MM-DD'),
          },
        })
      );
    }
  }, [activeInventoryItem, selectDate]);

  const addInventoryButton = () => {
    setIsOpen(true);
  };

  const closeInventoryButton = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isNotification) {
      setTimeout(() => {
        setIsNotification(false);
      }, 2000);
    }
  }, [isNotification]);

  return (
    <>
      <HeaderMain title={'Inventory'} noTabs={true}>
        <h2 className={styles.title}>
          <IoMdSettings
            className={styles.title__settings}
            onClick={() => {
              dispatch(setIsOpenNightModal(true));
            }}
          />
          {camerasData && <Button text="Add item" IconLeft={Plus} onClick={addInventoryButton} />}
        </h2>
      </HeaderMain>
      <AddInventoryModal
        isOpen={isOpen}
        handleClose={closeInventoryButton}
        setIsNotification={() => setIsNotification(true)}
      />
      <div className={styles.content}>
        <>
          <InventoryReport setIsNotification={() => setIsNotification(true)} />
        </>
      </div>
      {isOpenNightModal && (
        <NightModeModal
          isOpen={true}
          handleClose={() => {
            dispatch(setIsOpenNightModal(false));
          }}
        />
      )}
      {isNotification && <Notification status={true} message={'Item saved'} />}
    </>
  );
};
