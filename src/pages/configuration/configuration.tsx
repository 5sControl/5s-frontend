import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Camera } from '../../components/camera/Camera';
import { Cover } from '../../components/cover';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ConnectToDbModal } from './components/ConnectToDbModal';
import {
  selectConnectToDbModal,
  setIsOpenConnectToDbModal,
} from './components/ConnectToDbModal/connectToDbModalSlice';
import { DisconnectDbModal } from './components/DisconnectDbModal';
import {
  selectDisconnectDBModal,
  setIsOpenDisconnectModal,
} from './components/DisconnectDbModal/disconnectDbModalSlice';
import styles from './configuration.module.scss';
import { getConnectionsToDB, selectConnectionPage } from './connectionSlice';

export const Configuration: React.FC = () => {
  const [cookies] = useCookies(['token']);
  const { isOpenConnectToDbModal } = useAppSelector(selectConnectToDbModal);
  const { databases, isLoadingConnectionsToDB } = useAppSelector(selectConnectionPage);
  const { isOpenDisconnectModal } = useAppSelector(selectDisconnectDBModal);
  const dispatch = useAppDispatch();

  const handleCloseConnectModal = () => {
    dispatch(setIsOpenConnectToDbModal(false));
  };

  const handleCloseDisconnectModal = () => {
    dispatch(setIsOpenDisconnectModal(false));
  };

  const handleOpenModalConnect = () => {
    dispatch(setIsOpenConnectToDbModal(true));
  };

  const handleOpenModalDisconnect = () => {
    dispatch(setIsOpenDisconnectModal(true));
  };

  const handleConfirmDisconnectModal = () => {
    console.log('You are decconect!');
  };

  useEffect(() => {
    dispatch(
      getConnectionsToDB({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);

  return (
    <>
      <ConnectToDbModal isOpen={isOpenConnectToDbModal} handleClose={handleCloseConnectModal} />

      <DisconnectDbModal
        isOpen={isOpenDisconnectModal}
        dbName={databases ? databases.results[0].database : 'null'}
        handleClose={handleCloseDisconnectModal}
        handleConfirm={handleConfirmDisconnectModal}
      />

      <WrapperPage>
        <h2 className={styles.title}>Configuration</h2>

        <Cover className={styles.license}>
          <div>
            <p className={styles.license_title}>License</p>

            <h3 className={styles.license_count}>
              {'0/5'}&nbsp;
              <span className={styles.license_span}>algorithms used</span>
            </h3>
          </div>

          <button className={styles.button}>Upgrade Plan</button>
        </Cover>

        <div className={styles.database}>
          <div className={styles.database_container}>
            <h3 className={styles.database_title}>Database</h3>

            {databases ? (
              <button
                onClick={handleOpenModalDisconnect}
                disabled={isLoadingConnectionsToDB}
                className={styles.button_contained}
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleOpenModalConnect}
                disabled={isLoadingConnectionsToDB}
                className={styles.button}
              >
                Connect
              </button>
            )}
          </div>

          <span className={styles.database_desc}>
            {isLoadingConnectionsToDB ? (
              '...Loading'
            ) : databases ? (
              <span>
                Connected to <b>{databases.results[0].database}</b> database.
              </span>
            ) : (
              'Connect to database with your orders to view them in 5S Control.'
            )}
          </span>
        </div>
        <Camera />
      </WrapperPage>
    </>
  );
};
