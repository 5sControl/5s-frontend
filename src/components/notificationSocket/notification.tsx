import React from 'react';
import styles from './notification.module.scss';
import { Cross, NotificationBad } from '../../assets/svg/SVGcomponent';

type PropsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifications: any[];
  closeNotification: (id: number) => void;
};

export const NotificationSocket: React.FC<PropsType> = ({ notifications, closeNotification }) => {
  return (
    <div className={styles.wrapper}>
      {notifications.length > 0 &&
        notifications.map((notification, index) => (
          <div className={`${styles.container} ${styles.bad}`} key={index}>
            <div className={styles.text}>
              <NotificationBad />
              <span>{notification.message}</span>
            </div>

            <Cross onClick={() => closeNotification(index)} className={styles.cross} />
          </div>
        ))}
    </div>
  );
};
