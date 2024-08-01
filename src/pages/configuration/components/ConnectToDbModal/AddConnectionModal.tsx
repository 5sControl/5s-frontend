import { BaseSyntheticEvent, FormEventHandler, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { Input } from '../../../../components/input';
import { Modal } from '../../../../components/modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectConnectionPage, setDatabasesOrdersView } from '../../connectionSlice';
import { FormTypes, inputProps } from './config';
import styles from './connectToDbModal.module.scss';
import {
  createConnectionWithDB,
  selectConnectToDbModal,
  setConnectionType,
} from './connectToDbModalSlice';
import { ConnectionToDatabaseForm } from './types';
import { Notification } from '../../../../components/notification/notification';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const AddConnectionModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();

  const options = Object.keys(FormTypes) || [];
  const [selectValue, setSelectValue] = useState(options[0]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleClose();
    dispatch(setConnectionType(selectValue));
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal} disableClickBg={true}>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Add ERP connection</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
          {options.map((option, index) => (
            <option value={option} key={index}>
              {option}
            </option>
          ))}
        </select>

        <div className={styles.buttons}>
          <Button onClick={handleClose} text="Cancel" className={styles.cancel} />
          <Button type="submit" text="Done" className={styles.form_submit} />
        </div>
      </form>
    </Modal>
  );
};
