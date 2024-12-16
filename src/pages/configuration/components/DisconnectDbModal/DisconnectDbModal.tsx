import { Button } from '../../../../components/button';
import { Modal } from '../../../../components/modal';
import { DatabaseInfo } from '../../types';
import styles from './disconnectDbModal.module.scss';
import {
  disconnectDb,
  selectDisconnectDBModal,
  setConnectionToDisconnectData,
} from '../DisconnectDbModal/disconnectDbModalSlice';
import { useAppDispatch } from '../../../../store/hooks';
import { useCookies } from 'react-cookie';

type PropsType = {
  connectionData: DatabaseInfo | null;
  handleClose: () => void;
};

export const DisconnectDbModal: React.FC<PropsType> = ({ connectionData, handleClose }) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);

  const handleConfirm = () => {
    dispatch(
      disconnectDb({
        token: cookies.token,
        hostname: window.location.hostname,
        id: connectionData?.id || 0,
      })
    );
  };

  return (
    <Modal isOpen={!!connectionData} handleClose={handleClose} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Disconnect from database</h2>
      </div>

      <p className={styles.content}>
        Are you sure you want to disconnect from the <b>{connectionData?.erp_system}</b> database?
        All the information about orders will become unavailable.
      </p>

      <div className={styles.buttons}>
        <Button text={'Cancel'} variant="outlined" onClick={handleClose} />
        <Button text={'Disconnect'} className={styles.buttons_gap} onClick={handleConfirm} />
      </div>
    </Modal>
  );
};
