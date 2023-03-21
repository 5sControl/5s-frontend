import { Camera } from '../../components/camera/Camera';
import { Cover } from '../../components/cover';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ConnectToDbModal } from './components/ConnectToDbModal';
import {
  selectConnectToDbModal,
  setIsOpenConnectToDbModal,
} from './components/ConnectToDbModal/connectToDbModalSlice';
import styles from './configuration.module.scss';

export const Configuration: React.FC = () => {
  const { isOpenConnectToDbModal } = useAppSelector(selectConnectToDbModal);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(setIsOpenConnectToDbModal(false));
  };

  const handleOpenModal = () => {
    dispatch(setIsOpenConnectToDbModal(true));
  };

  return (
    <>
      <ConnectToDbModal isOpen={isOpenConnectToDbModal} handleClose={handleCloseModal} />
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

            <button onClick={handleOpenModal} className={styles.button}>
              Connect
            </button>
          </div>

          <span className={styles.database_desc}>
            Connect to database with your orders to view them in 5S Control.
          </span>
        </div>
        <Camera />
      </WrapperPage>
    </>
  );
};
