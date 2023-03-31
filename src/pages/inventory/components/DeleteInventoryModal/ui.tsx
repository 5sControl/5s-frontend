import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { Modal } from '../../../../components/modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './deleteInventoryModal.module.scss';
import { deleteItem, selectDeleteInventoryModal } from './deleteInventoryModalSlice';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
  id: number;
};

export const DeleteInventoryModal: React.FC<PropsType> = ({ isOpen, handleClose, id }) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);
  const { isLoadingDeleteRequest, connectDeleteResponse } = useAppSelector(
    selectDeleteInventoryModal
  );

  useEffect(() => {
    if (connectDeleteResponse) {
      handleClose();
    }
  }, [connectDeleteResponse]);

  const deleteAction = () => {
    dispatch(
      deleteItem({
        token: cookies.token,
        hostname: window.location.hostname,
        id,
      })
    );
    handleClose();
  };
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <div>
        <h4 className={styles.header}>Delete item?</h4>
        <p className={styles.text}>The item will be deleted. You can’t undo this action.</p>
      </div>
      <div className={styles.buttons}>
        <Button text="Cancel" className={styles.cancel} onClick={handleClose} />
        <Button text="Delete" onClick={deleteAction} disabled={isLoadingDeleteRequest} />
      </div>
    </Modal>
  );
};
