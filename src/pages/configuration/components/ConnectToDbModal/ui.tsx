import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { Input } from '../../../../components/input';
import { Modal } from '../../../../components/modal';
import { SelectBase } from '../../../../components/selectBase';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectConnectionPage, setDatabasesOrdersView } from '../../connectionSlice';
import { inputProps, listOfDataForSelect } from './config';
import styles from './connectToDbModal.module.scss';
import { createConnectionWithDB, selectConnectToDbModal } from './connectToDbModalSlice';
import { ConnectionToDatabaseForm } from './types';

type PropsType = {
  isOpen: boolean;
  isEdit: boolean;
  handleClose: () => void;
};

export const ConnectToDbModal: React.FC<PropsType> = ({ isOpen, isEdit, handleClose }) => {
  const [inputs, setInputs] = useState(inputProps);
  const [cookies] = useCookies(['token']);
  const {
    isLoadingPostConnectionToDb,
    isErrorLoadingPostConnectionToDb,
    connectResponse,
    errorConnectToDbResponse,
  } = useAppSelector(selectConnectToDbModal);
  const { databases } = useAppSelector(selectConnectionPage);
  const dispatch = useAppDispatch();

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      database_type: { value: string };
      database: { value: string };
      server: { value: string };
      port: { value: string };
      db_name: { value: string };
      username: { value: string };
      password: { value: string };
    };
    const database_type = target.database_type.value; // typechecks!
    const database = target.database.value; // typechecks!
    const server = target.server.value; // typechecks!
    const username = target.username.value; // typechecks!
    const password = target.password.value; // typechecks!

    const dataForm: ConnectionToDatabaseForm = {
      database_type,
      database,
      server,
      username,
      password,
    };

    dispatch(
      createConnectionWithDB({
        token: cookies.token,
        hostname: window.location.hostname,
        body: dataForm,
      })
    );
  };

  useEffect(() => {
    if (connectResponse?.success) {
      dispatch(setDatabasesOrdersView(connectResponse?.connection));
      handleClose();
    }
  }, [connectResponse]);

  useEffect(() => {
    if (isEdit) {
      const newInputsProps = inputs.map((el) => {
        return { ...el, defaultValue: databases.results[0][el.name] };
      });
      setInputs(newInputsProps);
    } else {
      setInputs(inputProps);
    }
  }, [isEdit]);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal} showCross>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Database connection</h2>
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.form_wrapper}>
          <SelectBase
            id="database_type"
            name="database_type"
            label="Database type"
            listOfData={listOfDataForSelect}
          />

          {inputs.map((props, index) => (
            <Input key={index} {...props} />
          ))}

          {isErrorLoadingPostConnectionToDb && (
            <div className={styles.form_error}>{errorConnectToDbResponse?.message}</div>
          )}
        </div>

        <Button
          disabled={isLoadingPostConnectionToDb}
          type="submit"
          text="Connect"
          className={styles.form_submit}
        />
      </form>
    </Modal>
  );
};
