import { useCookies } from 'react-cookie';
import { CloseCross } from '../../../../assets/svg/SVGcomponent';
import { Button } from '../../../../components/button/button';
import { Input } from '../../../../components/input';
import { Modal } from '../../../../components/modal';
import { SelectBase } from '../../../../components/selectBase';
import styles from './connectToDbModal.module.scss';
import { createConnection } from './connectToDbModalAPI';
import { ConnectionToDatabaseForm } from './types';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const ConnectToDbModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const [cookies] = useCookies(['token']);
  const listOfDataForSelect = [{ id: 0, text: 'WBNet' }];

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
    const port = target.port.value; // typechecks!
    const username = target.username.value; // typechecks!
    const password = target.password.value; // typechecks!

    const dataForm: ConnectionToDatabaseForm = {
      database_type,
      database,
      server,
      port,
      username,
      password,
    };

    createConnection(window.location.hostname, cookies.token, dataForm);
    console.log(dataForm);
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Connecting to database</h2>

        <CloseCross className={styles.header_cross} onClick={handleClose} />
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.form_wrapper}>
          <SelectBase
            id="database_type"
            name="database_type"
            label="Database type"
            listOfData={listOfDataForSelect}
          />

          <Input
            id="server"
            name="server"
            label="Host"
            type="text"
            required
            placeholder="Enter host"
          />

          <Input id="port" name="port" label="Port" type="text" placeholder="Enter port" />

          <Input
            id="database"
            name="database"
            label="Database name"
            type="text"
            placeholder="Enter database name"
            required
          />

          <Input
            id="username"
            name="username"
            label="User"
            type="text"
            placeholder="Enter user"
            required
          />

          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            showEye
            required
          />
        </div>

        <Button type="submit" text="Connect" className={styles.form_submit} />
      </form>
    </Modal>
  );
};
