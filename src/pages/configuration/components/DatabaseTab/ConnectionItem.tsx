import { useState } from 'react';
import { SettingsWhite } from '../../../../assets/svg/SVGcomponent';
import { Button } from '../../../../components/button';
import { DatabaseInfo } from '../../types';
import { ConnectionModal } from '../ConnectToDbModal/ConnectionModal';
import styles from './databaseTab.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  selectConnectToDbModal,
  setIsOpenConnectToDbModal,
} from '../ConnectToDbModal/connectToDbModalSlice';

export const ConnectionItem = ({ dataItem }: { dataItem: DatabaseInfo }) => {
  const [isModalAddConnection, setIsModalAddConnection] = useState(false);
  const [isEditConnectToDbModal, setIsEditConnectToDbModal] = useState(false);
  const { isOpenConnectToDbModal } = useAppSelector(selectConnectToDbModal);
  const dispatch = useAppDispatch();

  const handleOpenModalConnect = () => {
    dispatch(setIsOpenConnectToDbModal(true));
  };

  const handleOpenModalConnectionSettings = () => {
    dispatch(setIsOpenConnectToDbModal(true));
  };

  const handleCloseConnectModal = () => {
    dispatch(setIsOpenConnectToDbModal(false));
  };

  return (
    <>
      <ConnectionModal
        isOpen={false}
        isEdit={false}
        handleClose={handleCloseConnectModal}
        data={dataItem}
      />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h3 className={styles.header_title}>{dataItem.erp_system}</h3>
          {dataItem.is_active ? (
            <div className={`${styles.header_buttons}`}>
              <Button
                // onClick={() => setDisconectType('db')}
                // disabled={isLoadingGetConnectionsToDB}
                text="Disconnect"
                variant="outlined"
              />
              <Button
                onClick={handleOpenModalConnectionSettings}
                // disabled={isLoadingGetConnectionsToDB}
                IconLeft={SettingsWhite}
                text="Settings"
              />
            </div>
          ) : (
            <div className={`${styles.header_buttons}`}>
              <Button
                onClick={handleOpenModalConnect}
                // disabled={isLoadingGetConnectionsToDB}
                IconLeft={SettingsWhite}
                text="Settings"
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
