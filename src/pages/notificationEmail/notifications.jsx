import { useEffect, useState } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import { FcCheckmark } from 'react-icons/fc';
import { useCookies } from 'react-cookie';
import { IoMdSettings } from 'react-icons/io';
import { Button } from '../../components/button';
import { ModalEmail } from './components/modal';
import {
  deleteNotificationEmail,
  getNotificationEmail,
  getNotificationSettings,
  patchNotificationEmail,
  postNotificationEmail,
} from '../../api/notificationRequest';
import { SettingsWhite } from '../../assets/svg/SVGcomponent';
import { Notification } from '../../components/notification/notification';

import styles from './notifications.module.scss';

export const Notifications = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [emails, setEmails] = useState([]);
  const [cookies] = useCookies(['token']);
  const [defaultSettings, setDefaultSettings] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(false);

  useEffect(() => {
    if (!isShowModal) {
      getNotificationEmail(window.location.hostname, cookies.token)
        .then((res) => setEmails(res.data))
        .catch((err) => {
          console.log(err);
        });
      getNotificationSettings(window.location.hostname, cookies.token)
        .then((response) => {
          setDefaultSettings(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isShowModal]);

  const changeEmail = (e, id) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (e.key === 'Enter' && emailRegex.test(e.target.value)) {
      if (id === 0) {
        postNotificationEmail(window.location.hostname, cookies.token, {
          email: e.target.value,
        })
          .then(() => {
            getNotificationEmail(window.location.hostname, cookies.token)
              .then((res) => {
                setEmails(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        patchNotificationEmail(window.location.hostname, cookies.token, id, e.target.value)
          .then(() => {
            getNotificationEmail(window.location.hostname, cookies.token).then((res) => {
              setEmails(res.data);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const deleteEmail = (id) => {
    if (id !== 0) {
      deleteNotificationEmail(window.location.hostname, cookies.token, id)
        .then(() => {
          getNotificationEmail(window.location.hostname, cookies.token)
            .then((res) => {
              console.log(res.data);
              setEmails(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setEmails(emails.filter((email) => email.id !== 0));
    }
  };

  useEffect(() => {
    if (notificationMessage) {
      setTimeout(() => {
        setNotificationMessage(false);
      }, 2000);
    }
  }, [notificationMessage]);

  const changeHandler = (value, id) => {
    console.log(emails);
    console.log(value);
  };
  return (
    <>
      <section className={styles.server}>
        <div className={styles.server__header}>
          <h2>SMTP server</h2>
          <Button
            onClick={() => setIsShowModal(true)}
            IconLeft={SettingsWhite}
            text="Settings"
          ></Button>
        </div>
        <p className={styles.server__create}>Create SMTP server to send notifications.</p>
        {defaultSettings && defaultSettings.length > 0 && defaultSettings[0].server ? (
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
        ) : (
          <div className={styles.server__status}>
            <span className={styles.server__status_type}>Status:</span>
            <span className={styles.server__status_date}>Not connected</span>
          </div>
        )}
      </section>
      <section className={styles.emails}>
        <div className={styles.server__header}>
          <h2>Emails</h2>
        </div>
        <div className={styles.emails__container}>
          <div className={styles.emails__header}>
            <h3>Inventory</h3>
            {emails.filter((email) => email.id === 0).length === 0 && (
              <span
                className={styles.emails__header_add}
                onClick={() => setEmails([...emails, { id: 0, email: '' }])}
              >
                + Add email
              </span>
            )}
          </div>
          <p className={styles.emails__description}>
            These emails will receive notifications when items reach low stock level.
          </p>
          <div className={styles.emails__list}>
            {emails &&
              emails.length > 0 &&
              emails.map((email, index) => (
                <div key={index} className={styles.emails__list_div}>
                  <input
                    value={email.email}
                    onKeyUp={(e) => changeEmail(e, email.id)}
                    onChange={(e) => changeHandler(e.target.value, email.id)}
                  />
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
          setNotificationMessage={() => setNotificationMessage(true)}
        />
      )}
      {notificationMessage && (
        <Notification status={true} message={'Settings are saved successfully'} />
      )}
    </>
  );
};
