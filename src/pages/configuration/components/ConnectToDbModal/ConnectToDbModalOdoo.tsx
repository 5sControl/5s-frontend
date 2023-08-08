import { Modal } from '../../../../components/modal';
import { Input } from '../../../../components/input';

import styles from './connectToDbModal.module.scss';
import { useState } from 'react';
import { Button } from '../../../../components/button';
import { useAppDispatch } from '../../../../store/hooks';
import { createConnectionWithDB } from './connectToDbModalSlice';
import { useCookies } from 'react-cookie';
type PropsType = {
  handleClose: () => void;
  databases: any;
};

export const ConnectToDbModalOdoo: React.FC<PropsType> = ({ handleClose, databases }) => {
  const [text, setText] = useState<string>(databases ? databases.host : '');
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);
  const onSubmit = () => {
    const type = 'api'; // typechecks!
    const host = text;

    const dataForm = {
      type,
      host,
    };

    dispatch(
      createConnectionWithDB({
        token: cookies.token,
        hostname: window.location.hostname,
        body: dataForm,
      })
    );
  };
  return (
    <Modal isOpen={true} handleClose={handleClose} className={styles.modal} disableClickBg={true}>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Odoo connection settings</h2>
      </div>
      <div className={styles.container}>
        <label className={styles.label}>Host</label>
        <Input
          id="0"
          type={'text'}
          name={'type'}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
      </div>
      <div className={styles.buttonsNew}>
        <Button
          disabled={false}
          onClick={handleClose}
          text="Cancel"
          className={styles.cancel}
          variant="text"
        />
        <Button disabled={false} onClick={onSubmit} text="Done" className={styles.form_submit} />
      </div>
    </Modal>
  );
};
