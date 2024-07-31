import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';

import { getConnectionsToDB, selectConnectionPage } from '../../connectionSlice';
import { ConnectToDbModal } from '../ConnectToDbModal';
import {
  selectConnectToDbModal,
  setIsOpenConnectToDbModal,
} from '../ConnectToDbModal/connectToDbModalSlice';
import { DisconnectDbModal } from '../DisconnectDbModal';
import {
  disconnectDb,
  selectDisconnectDBModal,
  setIsOpenDisconnectModal,
} from '../DisconnectDbModal/disconnectDbModalSlice';
import styles from './databaseTab.module.scss';
import { Plus, SettingsWhite } from '../../../../assets/svg/SVGcomponent';
import { ConnectToDbModalOdoo } from '../ConnectToDbModal/ConnectToDbModalOdoo';

import s from '../../../configuration/configuration.module.scss';
import { AddConnectionModal } from '../ConnectToDbModal/AddConnectionModal';
import { ConnectionItem } from './ConnectionItem';
import { DatabaseInfo } from '../../types';

export const DatabaseTab: React.FC = () => {
  const [isModalAddConnection, setIsModalAddConnection] = useState(false);
  const [isEditConnectToDbModal, setIsEditConnectToDbModal] = useState(false);
  const [isModalOdoo, setIsModalOdoo] = useState<boolean>(false);
  const [cookies] = useCookies(['token']);
  const { databases, isLoadingGetConnectionsToDB } = useAppSelector(selectConnectionPage);
  const { isOpenConnectToDbModal } = useAppSelector(selectConnectToDbModal);
  const { isOpenDisconnectModal, disconnectDbResponse } = useAppSelector(selectDisconnectDBModal);
  const [disconectType, setDisconectType] = useState<string>('');
  const dispatch = useAppDispatch();

  const handleOpenModalDisconnect = () => {
    dispatch(setIsOpenDisconnectModal(true));
  };

  const handleOpenModalConnect = () => {
    dispatch(setIsOpenConnectToDbModal(true));
  };

  const handleOpenModalConnectionSettings = () => {
    dispatch(setIsOpenConnectToDbModal(true));
  };

  const handleCloseConnectModal = () => {
    dispatch(setIsOpenConnectToDbModal(false));
  };

  const handleCloseDisconnectModal = () => {
    dispatch(setIsOpenDisconnectModal(false));
  };

  const handleOpenModalOdoo = () => {
    setIsModalOdoo(true);
  };
  const handleOpenModalAddConnection = () => {
    setIsModalAddConnection(true);
  };
  // const handleConfirmDisconnectModal = () => {
  //   if (!databases) {
  //     console.error('You doesnt have any databases');
  //     return;
  //   }

  //   dispatch(
  //     disconnectDb({
  //       token: cookies.token,
  //       hostname: window.location.hostname,
  //       id: disconectType === 'db' ? databases.db.id : databases.api.id,
  //     })
  //   ).then(() => {
  //     setDisconectType('');
  //     dispatch(
  //       getConnectionsToDB({
  //         token: cookies.token,
  //         hostname: window.location.hostname,
  //       })
  //     );
  //   });
  // };

  useEffect(() => {
    if (disconnectDbResponse?.success) {
      handleCloseDisconnectModal();
    }
  }, [disconnectDbResponse]);

  useEffect(() => {
    if (databases) {
      setIsEditConnectToDbModal(true);
    } else {
      setIsEditConnectToDbModal(false);
    }
  }, [databases]);

  useEffect(() => {
    if (disconectType.length > 0) {
      handleOpenModalDisconnect();
    }
  }, [disconectType]);

  useEffect(() => {
    if (!isModalOdoo || isOpenConnectToDbModal) {
      dispatch(
        getConnectionsToDB({
          token: cookies.token,
          hostname: window.location.hostname,
        })
      );
    }
  }, [isModalOdoo, isOpenConnectToDbModal]);
  return (
    <>
      <AddConnectionModal
        isOpen={isModalAddConnection}
        isEdit={false}
        handleClose={() => setIsModalAddConnection(false)}
      />

      <ConnectToDbModal
        isOpen={isOpenConnectToDbModal}
        isEdit={isEditConnectToDbModal}
        handleClose={handleCloseConnectModal}
      />
      {/* {isModalOdoo && (
        <ConnectToDbModalOdoo handleClose={() => setIsModalOdoo(false)} databases={databases.api} />
      )} */}
      {/* <DisconnectDbModal
        isOpen={isOpenDisconnectModal}
        dbName={
          isLoadingGetConnectionsToDB
            ? 'null'
            : databases && databases.db
            ? databases?.db.database
            : 'null'
        }
        handleClose={handleCloseDisconnectModal}
        handleConfirm={handleConfirmDisconnectModal}
      /> */}

      <Button
        text="Add connection"
        className={s.buttonPosition}
        onClick={handleOpenModalAddConnection}
        IconLeft={Plus}
      />

      {/* <div className={styles.wrapper}>
        <div className={styles.header}>
          <h3 className={styles.header_title}>Winkhaus</h3>
          {databases && databases.db ? (
            <div className={`${styles.header_buttons}`}>
              <Button
                onClick={() => setDisconectType('db')}
                disabled={isLoadingGetConnectionsToDB}
                text="Disconnect"
                variant="outlined"
              />
              <Button
                onClick={handleOpenModalConnectionSettings}
                disabled={isLoadingGetConnectionsToDB}
                IconLeft={SettingsWhite}
                text="Settings"
              />
            </div>
          ) : (
            <div className={`${styles.header_buttons}`}>
              <Button
                onClick={handleOpenModalConnect}
                disabled={isLoadingGetConnectionsToDB}
                IconLeft={SettingsWhite}
                text="Settings"
              />
            </div>
          )}
        </div>

        <div className={styles.container}>
          <div className={styles.desc}>
            <span className={styles.desc_title}> Status: </span>
            <span>
              {isLoadingGetConnectionsToDB
                ? '...Loading'
                : databases && databases.db
                ? 'Connected, used for Orders View'
                : 'Not connected'}
            </span>
          </div>
          {databases && databases.db && (
            <>
              <div>
                <span className={styles.desc_title}>Database name: </span>
                <span className={styles.desc}>{databases.db.database}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <hr></hr>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h3 className={styles.header_title}>Odoo</h3>
          {databases && databases.api ? (
            <div className={`${styles.header_buttons}`}>
              <Button
                onClick={() => setDisconectType('api')}
                disabled={isLoadingGetConnectionsToDB}
                text="Disconnect"
                variant="outlined"
              />
              <Button
                onClick={handleOpenModalOdoo}
                disabled={isLoadingGetConnectionsToDB}
                IconLeft={SettingsWhite}
                text="Settings"
              />
            </div>
          ) : (
            <div className={`${styles.header_buttons}`}>
              <Button
                onClick={handleOpenModalOdoo}
                disabled={isLoadingGetConnectionsToDB}
                IconLeft={SettingsWhite}
                text="Settings"
              />
            </div>
          )}
        </div>
        <div className={styles.container}>
          <div className={styles.desc}>
            <span className={styles.desc_title}> Status: </span>
            <span>
              {isLoadingGetConnectionsToDB
                ? '...Loading'
                : databases && databases.api
                ? 'Connected'
                : 'Not connected'}
            </span>
          </div>
        </div>
      </div> */}

      {databases &&
        databases.map((database: DatabaseInfo) => (
          <ConnectionItem dataItem={database} key={database.id} />
        ))}
    </>
  );
};
