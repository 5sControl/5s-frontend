import { useEffect, useState } from 'react';
import { Button } from '../../components/button';
import styles from './notifications.module.scss';
import { ModalEmail } from './components/modal';
import { getNotificationEmail, getNotificationSettings } from '../../api/notificationRequest';
import { useCookies } from 'react-cookie';

export const Notifications = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [emails, setEmails] = useState([]);
  const [cookies] = useCookies(['token']);
  const [defaultSettings, setDefaultSettings] = useState(false);

  useEffect(() => {
    getNotificationEmail(window.location.hostname).then((res) => setEmails(res.data.results));
    getNotificationSettings(window.location.hostname, cookies.token).then((response) => {
      setDefaultSettings(response.data.results);
      console.log(response.data.results);
    });
  }, []);

  return (
    <>
      <section className={styles.server}>
        <div className={styles.server__header}>
          <h2>SMTP server</h2>
          <Button text="settings" onClick={() => setIsShowModal(true)} />
        </div>
        <p className={styles.server__create}>Create SMTP server to send notifications.</p>
        <div className={styles.server__status}>
          <span className={styles.server__status_type}>Status:</span>
          <span className={styles.server__status_date}>Not connected</span>
        </div>
      </section>
      <section>
        <div className={styles.server__header}>
          <h2>Emails</h2>
        </div>
      </section>
      {isShowModal && (
        <ModalEmail
          isOpen={isShowModal}
          handleClose={() => setIsShowModal(false)}
          token={cookies.token}
          defaultSettings={defaultSettings}
        />
      )}
    </>
  );
};
