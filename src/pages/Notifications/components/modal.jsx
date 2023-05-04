import { useEffect, useState } from 'react';
import { CloseCross } from '../../../assets/svg/SVGcomponent';
import { Input } from '../../../components/input';
import { Modal } from '../../../components/modal';
import styles from './modal.module.scss';
import { Button } from '../../../components/button';
import {
  patchNotificationSettings,
  postNotificationSettings,
} from '../../../api/notificationRequest';

export const ModalEmail = ({ isOpen, handleClose, token, defaultSettings }) => {
  const [server, setServer] = useState('');
  const [port, setPort] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isTls, setIsTls] = useState(false);
  const [isSsl, setIsSsl] = useState(false);

  const save = () => {
    const response = {
      server: server,
      port: port,
      username: username,
      password: password,
      email_use_tls: isTls,
      email_use_ssl: isSsl,
    };

    if (defaultSettings) {
      patchNotificationSettings(window.location.hostname, token, response).then((response) => {
        handleClose();
      });
    } else {
      postNotificationSettings(window.location.hostname, token, response).then((response) => {
        handleClose();
      });
    }

    // console.log(response);
  };
  useEffect(() => {
    if (defaultSettings && defaultSettings.length > 0) {
      setServer(defaultSettings[0].server);
      setPort(defaultSettings[0].port);
      setUsername(defaultSettings[0].username);
      setPassword(defaultSettings[0].password);
      setIsTls(defaultSettings[0].email_use_tls);
      setIsSsl(defaultSettings[0].email_use_ssl);
    }
  }, []);
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.wrapper}>
      <section className={styles.modal}>
        <div className={styles.modal__header}>
          <h2>SMTP server</h2>
          <CloseCross className={styles.modal__header_close} onClick={handleClose} />
        </div>
        <label>Server</label>
        <Input
          type="text"
          className={styles.modal__input}
          value={server}
          onChange={(e) => setServer(e.target.value)}
        />
        <label>Port</label>
        <Input
          type="text"
          className={styles.modal__input}
          value={port}
          onChange={(e) => setPort(e.target.value.replace(/[^\d]/g, ''))}
        />
        <label>Username</label>
        <Input
          type="text"
          className={styles.modal__input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <Input
          type="password"
          showEye={true}
          className={styles.modal__input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isTls}
            onChange={() => setIsTls(!isTls)}
          />
          Email use tls
        </label>
        <label>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isSsl}
            onChange={() => setIsSsl(!isSsl)}
          />
          Email use ssl
        </label>
        <Button text="Done" className={styles.save} onClick={save} />
      </section>
    </Modal>
  );
};
