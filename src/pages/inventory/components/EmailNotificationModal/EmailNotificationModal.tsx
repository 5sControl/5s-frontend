import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Modal } from '../../../../components/modal';
import { useAppDispatch } from '../../../../store/hooks';

import styles from '../InventoryModal.module.scss';
import './moveable.scss';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const EmailNotificationModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isClose, setIsClose] = useState<boolean>(false);

  useEffect(() => {}, []);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal} disableClickBg={true}>
      <div>fdf</div>
    </Modal>
  );
};
