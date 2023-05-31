import React from 'react';
import styles from './notification.module.scss';
import { Cross, NotificationBad } from '../../assets/svg/SVGcomponent';
import { Link } from 'react-router-dom';

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
          <div className={`${styles.container} ${index > 2 ? styles.hide : ''}`} key={index}>
            <Link to="/info/message" className={styles.text}>
              <NotificationBad />
              <span>{notification.message}</span>
            </Link>
            <Cross onClick={() => closeNotification(index)} className={styles.cross} />
          </div>
        ))}
    </div>
  );
};
