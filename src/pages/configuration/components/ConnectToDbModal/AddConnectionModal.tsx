import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { Input } from '../../../../components/input';
import { Modal } from '../../../../components/modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectConnectionPage, setDatabasesOrdersView } from '../../connectionSlice';
import { inputProps } from './config';
import styles from './connectToDbModal.module.scss';
import { createConnectionWithDB, selectConnectToDbModal } from './connectToDbModalSlice';
import { ConnectionToDatabaseForm } from './types';
import { Notification } from '../../../../components/notification/notification';

type PropsType = {
  isOpen: boolean;
  isEdit: boolean;
  handleClose: () => void;
};

export const AddConnectionModal: React.FC<PropsType> = ({ isOpen, isEdit, handleClose }) => {
  // const [inputs, setInputs] = useState(inputProps);
  // const [cookies] = useCookies(['token']);
  // const { isLoadingPostConnectionToDb, isErrorLoadingPostConnectionToDb, connectResponse } =
  //   useAppSelector(selectConnectToDbModal);
  // const { databases } = useAppSelector(selectConnectionPage);
  // const dispatch = useAppDispatch();

  // const onSubmit = (e: React.SyntheticEvent) => {
  //   e.preventDefault();

  //   const target = e.target as typeof e.target & {
  //     type: { value: string };
  //     database: { value: string };
  //     server: { value: string };
  //     port: { value: string };
  //     db_name: { value: string };
  //     username: { value: string };
  //     password: { value: string };
  //   };

  //   const type = 'database'; // typechecks!
  //   const database = target.database.value; // typechecks!
  //   const server = target?.server?.value;
  //   const port = target?.port?.value; // typechecks!
  //   const username = target.username.value; // typechecks!
  //   const password = target.password.value; // typechecks!

  //   const dataForm: ConnectionToDatabaseForm = {
  //     type,
  //     database,
  //     server,
  //     port,
  //     username,
  //     password,
  //   };

  //   dispatch(
  //     createConnectionWithDB({
  //       token: cookies.token,
  //       hostname: window.location.hostname,
  //       body: dataForm,
  //     })
  //   );
  // };

  // useEffect(() => {
  //   if (connectResponse?.success) {
  //     dispatch(setDatabasesOrdersView(connectResponse?.connection));
  //     handleClose();
  //   }
  // }, [connectResponse]);

  // useEffect(() => {
  //   if (isEdit) {
  //     const newInputsProps = inputs.map((el) => {
  //       return {
  //         ...el,
  //         defaultValue: databases.db ? databases.db[el.name] : '',
  //       };
  //     });

  //     setInputs(newInputsProps);
  //   } else {
  //     setInputs(inputProps);
  //   }
  // }, [isEdit]);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal} disableClickBg={true}>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Add ERP connection</h2>
      </div>

      <form className={styles.form}>
        <div className={styles.form_wrapper}>
          {/* {inputs.map((props, index) => (
            <div key={index} className={index === 2 ? styles.inputContainer : ''}>
              <Input {...props} />
            </div>
          ))} */}

          {/* {isErrorLoadingPostConnectionToDb && (
            <Notification status={false} message="Could not connect to database" />
          )} */}
        </div>
        <div className={styles.buttons}>
          <Button
            // disabled={isLoadingPostConnectionToDb}
            onClick={handleClose}
            text="Cancel"
            className={styles.cancel}
          />
          <Button
            // disabled={isLoadingPostConnectionToDb}
            type="submit"
            text="Done"
            className={styles.form_submit}
          />
        </div>
      </form>
    </Modal>
  );
};
