import React from 'react';
import styles from './notification.module.scss';
import {
  Cross,
  NotificationBad,
  NotificationGood,
  NotificationInfo,
  NotificationWarning,
} from '../../assets/svg/SVGcomponent';
import { Link } from 'react-router-dom';

type PropsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifications: any[];
  closeNotification: (id: number) => void;
};

// error, warning, info, success
export const NotificationSocket: React.FC<PropsType> = ({ notifications, closeNotification }) => {
  return (
    <div className={styles.wrapper}>
      {notifications.length > 0 &&
        notifications.map((notification, index) => (
          <div
            className={`${styles.container} ${index > 2 ? styles.hide : ''} ${
              notification.status === 'error'
                ? styles.error
                : notification.status === 'success'
                ? styles.success
                : notification.status === 'warning'
                ? styles.warning
                : styles.info
            }`}
            key={index}
          >
            <Link to="/info/message" className={styles.text}>
              {notification.status === 'error' && <NotificationBad />}
              {notification.status === 'success' && <NotificationGood />}
              {notification.status === 'warning' && <NotificationWarning />}
              {notification.status === 'info' && <NotificationInfo />}
              <span>{notification.message}</span>
            </Link>
            <Cross onClick={() => closeNotification(index)} className={styles.cross} />
          </div>
        ))}
    </div>
  );
};
