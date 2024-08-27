import { Button } from '../../../../components/button';
import { Modal } from '../../../../components/modal';
import styles from './disconnectDbModal.module.scss';

type PropsType = {
  dbName: string;
  handleClose: () => void;
};

export const DisconnectDbModal: React.FC<PropsType> = ({ dbName, handleClose }) => {
  return (
    <Modal isOpen={true} handleClose={handleClose} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Disconnect from database</h2>
      </div>

      <p className={styles.content}>
        Are you sure you want to disconnect from the <b>{dbName}</b> database? All the information
        about orders will become unavailable.
      </p>

      <div className={styles.buttons}>
        <Button text={'Cancel'} variant="outlined" onClick={handleClose} />
        <Button
          text={'Disconnect'}
          className={styles.buttons_gap}
          onClick={() => console.log('sdfsdfsf')}
        />
      </div>
    </Modal>
  );
};
