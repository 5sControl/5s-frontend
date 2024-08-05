import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { Input } from '../../../../components/input';
import { Modal } from '../../../../components/modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectConnectionPage, setDatabasesOrdersView } from '../../connectionSlice';
import { FormTypes } from './config';
import styles from './connectToDbModal.module.scss';
import { createConnectionWithDB, selectConnectToDbModal } from './connectToDbModalSlice';
import { ConnectionToDatabaseForm } from './types';
import { Notification } from '../../../../components/notification/notification';
import { DatabaseInfo } from '../../types';
import { useForm, SubmitHandler } from 'react-hook-form';

type PropsType = {
  handleClose: () => void;
  type: string | null;
  data: DatabaseInfo | null;
};

export const ConnectionModal: React.FC<PropsType> = ({ handleClose, type, data }) => {
  const inputs = FormTypes[type as keyof typeof FormTypes] || [];

  const [cookies] = useCookies(['token']);
  const { isLoadingPostConnectionToDb, isErrorLoadingPostConnectionToDb, connectResponse } =
    useAppSelector(selectConnectToDbModal);
  const { databases } = useAppSelector(selectConnectionPage);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, setValue, reset } = useForm();

  const onSubmit = (body: any) => {
    dispatch(
      createConnectionWithDB({
        token: cookies.token,
        hostname: window.location.hostname,
        body,
      })
    );
  };

  useEffect(() => {
    reset();

    const fields = Object.entries((data as object) || {});
    const filteredFields = fields.filter((field) => field[1] != null && field[0] != 'id');
    filteredFields.forEach((field) => {
      if (field[0] == 'is_active') {
        setValue('is_active', true);
      } else {
        setValue(field[0], field[1]);
      }
    });
  }, [data]);

  // useEffect(() => {
  //   if (connectResponse?.status) {
  //     dispatch(setDatabasesOrdersView(connectResponse?.connection));
  //   }
  // }, [connectResponse]);

  return (
    <>
      <Modal isOpen={!!type} handleClose={handleClose} className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.header_title}>
            {data ? <>{type} connection settings</> : <>Add ERP connection</>}
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.form_wrapper}>
            {inputs.map((props, index) => (
              <div
                key={index}
                // className={`${index === 2 ? styles.inputContainer : ''} ${props.type}`}
                className={props.type}
              >
                <Input {...props} register={register(props.name)} />
              </div>
            ))}

            {isErrorLoadingPostConnectionToDb && (
              <Notification status={false} message="Could not connect to database" />
            )}
          </div>
          <div className={styles.buttons}>
            <Button
              disabled={isLoadingPostConnectionToDb}
              onClick={handleClose}
              text="Cancel"
              className={styles.cancel}
            />
            <Button
              disabled={isLoadingPostConnectionToDb}
              type="submit"
              text="Done"
              className={styles.form_submit}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
