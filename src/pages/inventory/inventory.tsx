import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../components/button/button';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { AddInventoryModal } from './components/AddInventoryModal';
import { InventoryReport } from './components/InventoryReport';
import {
  getCamerasAsync,
  getEmailListForNotification,
  getInventoryItemHistoryAsync,
  getSMTPConnect,
  selectInventory,
  setNotificationInfo,
} from './inventorySlice';
import styles from './inventory.module.scss';
import { selectActiveInventoryItem } from './components/InventoryItemsList/InventoryItemsListSlice';
import moment from 'moment';
import { selectInventoryHistory } from './components/InventoryHistory/inventoryHistorySlice';
import { Plus } from '../../assets/svg/SVGcomponent';
import {
  selectNightInventoryModal,
  setIsOpenNightModal,
} from './components/NightModeModal/NightModeSlice';

import { IoMdSettings } from 'react-icons/io';
import { NightModeModal } from './components/NightModeModal';
import { Notification } from '../../components/notification/notification';
import { EmailNotificationModal } from './components/EmailNotificationModal/EmailNotificationModal';
import { getCompanies } from '../company/companySlice';

export const Inventory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { camerasData } = useAppSelector(selectInventory);
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);
  const { selectDate } = useAppSelector(selectInventoryHistory);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cookies] = useCookies(['token']);
  const [isNotification, setIsNotification] = useState<boolean>(false);
  const [isOpenEmailNotification, setIsOpenEmailNotification] = useState<boolean>(false);

  const { isOpenNightModal } = useAppSelector(selectNightInventoryModal);

  useEffect(() => {
    dispatch(getCamerasAsync({ token: cookies.token, hostname: window.location.hostname }));
    dispatch(getSMTPConnect({ token: cookies.token, hostname: window.location.hostname }));
    dispatch(
      getEmailListForNotification({ token: cookies.token, hostname: window.location.hostname })
    );
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
    dispatch(
      setNotificationInfo({
        to_emails: null,
        copy_emails: null,
        subject: null,
      })
    );
  };

  const closeInventoryButton = () => {
    setIsOpen(false);
  };

  const openEmailNotificationOpen = () => {
    setIsOpenEmailNotification(true);
  };

  useEffect(() => {
    if (isNotification) {
      setTimeout(() => {
        setIsNotification(false);
      }, 2000);
    }
  }, [isNotification]);

  useEffect(() => {
    dispatch(
      getCompanies({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);

  return (
    <>
      <AddInventoryModal
        isOpen={isOpen}
        isHide={isOpenEmailNotification}
        handleClose={closeInventoryButton}
        setIsNotification={() => setIsNotification(true)}
        handleOpenEditNotificationModal={openEmailNotificationOpen}
      />
      {isOpenEmailNotification && (
        <EmailNotificationModal
          isOpen={isOpenEmailNotification}
          isAddItemModal={true}
          handleClose={() => setIsOpenEmailNotification(false)}
        />
      )}
      <WrapperPage>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Inventory{' '}
              <IoMdSettings
                className={styles.title__settings}
                onClick={() => {
                  dispatch(setIsOpenNightModal(true));
                }}
              />
            </h2>
            {camerasData && <Button text="Add item" IconLeft={Plus} onClick={addInventoryButton} />}
          </div>
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
      </WrapperPage>
    </>
  );
};
