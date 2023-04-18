import { useEffect, useState } from 'react';
import { Button } from '../../components/button';
import styles from './notifications.module.scss';
import { ModalEmail } from './components/modal';
import {
  deleteNotificationEmail,
  getNotificationEmail,
  getNotificationSettings,
  patchNotificationEmail,
  postNotificationEmail,
} from '../../api/notificationRequest';
import { BsFillTrashFill } from 'react-icons/bs';
import { FcCheckmark } from 'react-icons/fc';
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

  const changeEmail = (e, id) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log();
    if (e.key === 'Enter' && emailRegex.test(e.target.value)) {
      if (id === 0) {
        postNotificationEmail(window.location.hostname, cookies.token, {
          email: e.target.value,
          is_active: false,
        }).then(() => {
          getNotificationEmail(window.location.hostname).then((res) => {
            setEmails(res.data.results);
            console.log(res);
          });
        });
      } else {
        patchNotificationEmail(window.location.hostname, cookies.token, id, e.target.value).then(
          (res) => {
            getNotificationEmail(window.location.hostname).then((res) => {
              setEmails(res.data.results);
              console.log(res);
            });
            console.log(res);
          }
        );
      }
      console.log(e.target.value, id);
    }
  };

  const deleteEmail = (id) => {
    deleteNotificationEmail(window.location.hostname, cookies.token, id);
    getNotificationEmail(window.location.hostname).then((res) => {
      setEmails(res.data.results);
      console.log(res);
    });
  };

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
        {defaultSettings && (
          <>
            <div className={styles.server__status}>
              <span className={styles.server__status_type}>Server:</span>
              <span className={styles.server__status_date}>{defaultSettings[0].server}</span>
            </div>
            <div className={styles.server__status}>
              <span className={styles.server__status_type}>Username:</span>
              <span className={styles.server__status_date}>{defaultSettings[0].username}</span>
            </div>
            <div className={styles.server__status}>
              <span className={styles.server__status_type}>Uses:</span>
              <span className={styles.server__status_date}>{`${
                defaultSettings[0].email_use_tls ? 'tsl' : ''
              } ${defaultSettings[0].email_use_ssl ? 'ssl' : ''}`}</span>
            </div>
          </>
        )}
      </section>
      <section className={styles.emails}>
        <div className={styles.server__header}>
          <h2>Emails</h2>
        </div>
        <div className={styles.emails__container}>
          <div className={styles.emails__header}>
            <h3>Inventory</h3>

            <span
              className={styles.emails__header_add}
              onClick={() => setEmails([...emails, { id: 0, email: '' }])}
            >
              + Add email
            </span>
          </div>
          <p className={styles.emails__description}>
            These emails will receive notifications when items reach low stock level.
          </p>
          <div className={styles.emails__list}>
            {emails.length > 0 &&
              emails.map((email, index) => (
                <div key={index} className={styles.emails__list_div}>
                  <input defaultValue={email.email} onKeyUp={(e) => changeEmail(e, email.id)} />
                  <BsFillTrashFill onClick={() => deleteEmail(email.id)} className={styles.trash} />
                  {email.id !== 0 && <FcCheckmark className={styles.checkmark} />}
                </div>
              ))}
          </div>
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
