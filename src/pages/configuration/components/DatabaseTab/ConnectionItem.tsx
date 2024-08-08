import { useState } from 'react';
import { SettingsWhite } from '../../../../assets/svg/SVGcomponent';
import { Button } from '../../../../components/button';
import { DatabaseInfo } from '../../types';
import styles from './databaseTab.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  selectConnectToDbModal,
  setConnectionType,
  setCurrentConnectionData,
} from '../ConnectToDbModal/connectToDbModalSlice';
import {
  disconnectDb,
  selectDisconnectDBModal,
  setConnectionToDisconnectData,
} from '../DisconnectDbModal/disconnectDbModalSlice';

export const ConnectionItem = ({ dataItem }: { dataItem: DatabaseInfo }) => {
  const [isModalAddConnection, setIsModalAddConnection] = useState(false);
  const [isEditConnectToDbModal, setIsEditConnectToDbModal] = useState(false);
  const { connectionType, connectResponse } = useAppSelector(selectConnectToDbModal);
  const dispatch = useAppDispatch();

  const handleOpenModalConnectionSettings = () => {
    dispatch(setConnectionType(dataItem.erp_system));
    dispatch(setCurrentConnectionData(dataItem));
  };

  const handleCloseConnectModal = () => {
    dispatch(setConnectionType(null));
  };

  const handleOpenDisconnectModal = () => {
    dispatch(setConnectionToDisconnectData(dataItem));
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h3 className={styles.header_title}>{dataItem.erp_system}</h3>
          {dataItem.is_active ? (
            <div className={`${styles.header_buttons}`}>
              <Button
                onClick={handleOpenDisconnectModal}
                // disabled={isLoadingGetConnectionsToDB}
                text="Disconnect"
                variant="outlined"
              />
              <Button
                onClick={handleOpenModalConnectionSettings}
                // disabled={isLoadingGetConnectionsToDB}
                IconLeft={SettingsWhite}
                text="Settings"
                disabled
              />
            </div>
          ) : (
            <div className={`${styles.header_buttons}`}>
              <Button
                onClick={handleOpenModalConnectionSettings}
                // disabled={isLoadingGetConnectionsToDB}
                IconLeft={SettingsWhite}
                text="Settings"
                disabled
              />
            </div>
          )}
        </div>

        <div className={styles.container}>
          <div className={styles.desc}>
            <span className={styles.desc_title}> Status: </span>
            <span>{dataItem.is_active ? 'Connected, used for Orders View' : 'Not connected'}</span>
          </div>
          <div className={styles.desc}>
            <span className={styles.desc_title}> Domain: </span>
            <span>{dataItem.host}</span>
          </div>
        </div>
      </div>
    </>
  );
};
