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
              notification.type === 'error'
                ? styles.error
                : notification.type === 'success'
                ? styles.success
                : notification.type === 'warning'
                ? styles.warning
                : styles.info
            }`}
            key={index}
          >
            <Link to="/info/message" className={styles.text}>
              {notification.type === 'error' && <NotificationBad />}
              {notification.type === 'success' && <NotificationGood />}
              {notification.type === 'warning' && <NotificationWarning />}
              {notification.type === 'info' && <NotificationInfo />}
              <span>{notification.message}</span>
            </Link>
            <Cross onClick={() => closeNotification(index)} className={styles.cross} />
          </div>
        ))}
    </div>
  );
};
