import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { clearOrdersList } from '../../../previewOrders/components/OrdersList/ordersListSlice';
import { clearDatabasesOrdersView, selectConnectionPage } from '../../connectionSlice';
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
import { SettingsWhite } from '../../../../assets/svg/SVGcomponent';
export const DatabaseTab: React.FC = () => {
  const [isEditConnectToDbModal, setIsEditConnectToDbModal] = useState(false);
  const [cookies] = useCookies(['token']);
  const { databases, isLoadingGetConnectionsToDB } = useAppSelector(selectConnectionPage);
  const { isOpenConnectToDbModal } = useAppSelector(selectConnectToDbModal);
  const { isOpenDisconnectModal, disconnectDbResponse } = useAppSelector(selectDisconnectDBModal);

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

  const handleConfirmDisconnectModal = () => {
    if (!databases) {
      console.error('You doesnt have any databases');
      return;
    }

    dispatch(
      disconnectDb({
        token: cookies.token,
        hostname: window.location.hostname,
        id: databases.db.id,
      })
    ).then(() => {
      dispatch(clearDatabasesOrdersView());
      dispatch(clearOrdersList());
    });
  };

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

  return (
    <>
      <ConnectToDbModal
        isOpen={isOpenConnectToDbModal}
        isEdit={isEditConnectToDbModal}
        handleClose={handleCloseConnectModal}
      />

      <DisconnectDbModal
        isOpen={isOpenDisconnectModal}
        dbName={
          isLoadingGetConnectionsToDB
            ? 'null'
            : databases && databases?.count > 0
            ? databases?.db.database
            : 'null'
        }
        handleClose={handleCloseDisconnectModal}
        handleConfirm={handleConfirmDisconnectModal}
      />

      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h3 className={styles.header_title}>Winkhaus</h3>
          {databases && databases.db ? (
            <div className={`${styles.header_buttons}`}>
              <Button
                onClick={handleOpenModalDisconnect}
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
                : databases && databases?.count > 0
                ? 'Connected, used for Orders View'
                : 'Not connected'}
            </span>
          </div>
          {databases && databases?.count > 0 && (
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
          {/* {false ? (
            <div className={`${styles.header_buttons}`}>
              <Button
                onClick={handleOpenModalDisconnect}
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
          ) : ( */}
          <div className={`${styles.header_buttons}`}>
            <Button
              onClick={handleOpenModalConnect}
              disabled={isLoadingGetConnectionsToDB}
              text="Settings"
            />
          </div>
          {/* )} */}
        </div>

        <div className={styles.container}>
          <div className={styles.desc}>
            <span className={styles.desc_title}> Status: </span>
            <span>
              {isLoadingGetConnectionsToDB
                ? '...Loading'
                : databases && databases?.count > 0
                ? 'Connected'
                : 'Not connected'}
            </span>
          </div>
          {false && (
            <>
              <div>
                <span className={styles.desc_title}>Database name: </span>
                <span className={styles.desc}>{databases.db.database}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
