import { Input } from '../../../../components/input';
import { Modal } from '../../../../components/modal';
import styles from './connectToDbModal.module.scss';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const ConnectToDbModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <div>Connecting to database</div>
      <Input
        id="1"
        name="test"
        type="select"
        label="Click me!"
        onChange={() => console.log(';click')}
        placeholder="Click me!"
      />
    </Modal>
  );
};
