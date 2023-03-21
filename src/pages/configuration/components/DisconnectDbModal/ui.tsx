import { Button } from '../../../../components/button/button';
import { Modal } from '../../../../components/modal';
import styles from './disconnectDbModal.module.scss';

type PropsType = {
  isOpen: boolean;
  dbName: string;
  handleClose: () => void;
  handleConfirm: () => void;
};

export const DisconnectDbModal: React.FC<PropsType> = ({
  isOpen,
  dbName,
  handleClose,
  handleConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Disconnect from database</h2>
      </div>

      <p className={styles.content}>
        Are you sure you want to disconnect from the <b>{dbName}</b> database? All the information
        about orders will become unavailable.
      </p>

      <div className={styles.buttons}>
        <Button text={'Cancel'} onClick={handleClose} />
        <Button text={'Disconnect'} className={styles.buttons_gap} onClick={handleConfirm} />
      </div>
    </Modal>
  );
};
